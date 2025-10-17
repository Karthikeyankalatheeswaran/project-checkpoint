from rest_framework.response import Response
from rest_framework.decorators import api_view
from .services.rawg_api import get_games
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Game, GameLog
from .serializers import GameSerializer, GameLogSerializer
from django.contrib.auth.models import User
from rest_framework import status
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from django.shortcuts import get_object_or_404
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import MyTokenObtainPairSerializer

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

# Update a game log
@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def edit_game_log(request, log_id):
    log = get_object_or_404(GameLog, id=log_id, user=request.user)
    data = request.data

    log.status = data.get("status", log.status)
    log.hours_played = data.get("hours_played", log.hours_played)
    log.review = data.get("review", log.review)
    log.rating = data.get("rating", log.rating)
    log.save()

    return Response({"message": "Log updated successfully", "log": GameLogSerializer(log).data})

# Delete a game log
@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def delete_game_log(request, log_id):
    log = get_object_or_404(GameLog, id=log_id, user=request.user)
    log.delete()
    return Response({"message": "Log deleted successfully"}, status=status.HTTP_204_NO_CONTENT)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def user_dashboard(request):
    status_filter = request.GET.get("status")  # optional filter: playing, completed, wishlist
    page = request.GET.get("page", 1)
    
    try:
        page = int(page)
        if page < 1:
            page = 1
    except (ValueError, TypeError):
        page = 1
        
    user_logs = GameLog.objects.filter(user=request.user)

    if status_filter:
        user_logs = user_logs.filter(status=status_filter)

    # Add pagination for dashboard
    page_size = 12  # Match your frontend requirement
    start_index = (page - 1) * page_size
    end_index = start_index + page_size
    paginated_logs = user_logs[start_index:end_index]

    serializer = GameLogSerializer(paginated_logs, many=True)
    return Response({
        "logs": serializer.data,
        "total_logs": user_logs.count(),
        "total_pages": (user_logs.count() + page_size - 1) // page_size,
        "current_page": page
    })


@api_view(["GET"])
@permission_classes([AllowAny])
def search_games(request):
    query = request.GET.get("q", "")  # default empty string
    page = request.GET.get("page", 1)
    
    try:
        page = int(page)
        if page < 1:
            page = 1
    except (ValueError, TypeError):
        page = 1

    # Check DB first - add pagination here too
    games = Game.objects.all()
    if games.exists() and not query:
        # Add basic pagination for DB results
        page_size = 20  # Match RAWG API page size
        start_index = (page - 1) * page_size
        end_index = start_index + page_size
        paginated_games = games[start_index:end_index]
        
        serializer = GameSerializer(paginated_games, many=True)
        return Response({
            "results": serializer.data, 
            "source": "db",
            "count": games.count(),
            "total_pages": (games.count() + page_size - 1) // page_size,
            "current_page": page
        })

    # Fetch from RAWG with proper page parameter
    data = get_games(search_query=query, page=page)
    results = []

    for g in data.get("results", []):
        game, _ = Game.objects.get_or_create(
            rawg_id=g["id"],
            defaults={
                "name": g["name"],
                "released": g.get("released"),
                "background_image": g.get("background_image"),
                "rating": g.get("rating"),
            },
        )
        results.append(GameSerializer(game).data)

    # Preserve RAWG pagination info
    response_data = {
        "results": results, 
        "source": "rawg",
        "count": data.get("count", 0),
        "next": data.get("next"),
        "previous": data.get("previous"),
        "total_pages": data.get("total_pages", 1),
        "current_page": page
    }
    
    return Response(response_data)


@api_view(["POST"])
@permission_classes([AllowAny])
def register_user(request):
    data = request.data
    username = data.get("username")
    email = data.get("email")
    password = data.get("password")

    if not username or not email or not password:
        return Response({"error": "All fields required"}, status=status.HTTP_400_BAD_REQUEST)

    if User.objects.filter(username=username).exists():
        return Response({"error": "Username already exists"}, status=status.HTTP_400_BAD_REQUEST)

    if User.objects.filter(email=email).exists():
        return Response({"error": "Email already exists"}, status=status.HTTP_400_BAD_REQUEST)

    # Create user
    user = User.objects.create_user(username=username, email=email, password=password)

    # Generate JWT tokens
    refresh = RefreshToken.for_user(user)
    return Response(
        {
            "access": str(refresh.access_token),
            "refresh": str(refresh),
        },
        status=status.HTTP_201_CREATED,
    )


# Add game to DB (if not exists)
def get_or_create_game(rawg_game_data):
    game, created = Game.objects.get_or_create(
        rawg_id=rawg_game_data["id"],
        defaults={
            "name": rawg_game_data["name"],
            "released": rawg_game_data.get("released"),
            "background_image": rawg_game_data.get("background_image"),
            "rating": rawg_game_data.get("rating"),
        },
    )
    return game

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def log_game(request):
    rawg_id = request.data.get("rawg_id")
    status_val = request.data.get("status")
    hours_played = request.data.get("hours_played", 0)
    review = request.data.get("review", "")
    rating = request.data.get("rating")
    platform = request.data.get("platform", "")
    # fetch game from DB or RAWG API
    try:
        game = Game.objects.get(rawg_id=rawg_id)
    except Game.DoesNotExist:
        # fallback to RAWG API
        from .services.rawg_api import get_games
        api_data = get_games()
        game_data = next((g for g in api_data["results"] if g["id"] == int(rawg_id)), None)
        if not game_data:
            return Response({"error": "Game not found"}, status=status.HTTP_404_NOT_FOUND)
        game = get_or_create_game(game_data)

    # create or update GameLog
    log, created = GameLog.objects.update_or_create(
        user=request.user,
        game=game,
        defaults={
            "status": status_val,
            "hours_played": hours_played,
            "review": review,
            "rating": rating,
            "platform": platform,
        },
    )

    serializer = GameLogSerializer(log)
    return Response(serializer.data, status=status.HTTP_201_CREATED)


@api_view(["GET"])
def games_list(request):
    search = request.GET.get("search")
    page = request.GET.get("page", 1)
    
    try:
        page = int(page)
        if page < 1:
            page = 1
    except (ValueError, TypeError):
        page = 1
        
    data = get_games(search_query=search, page=page)
    return Response(data)

@api_view(["GET"])
@permission_classes([AllowAny])
def get_game_detail(request, rawg_id):
    try:
        game = Game.objects.get(rawg_id=rawg_id)
        serializer = GameSerializer(game)
        return Response(serializer.data)
    except Game.DoesNotExist:
        # fallback: fetch from RAWG API
        data = get_games()
        game_data = next((g for g in data["results"] if g["id"] == int(rawg_id)), None)
        if not game_data:
            return Response({"error": "Game not found"}, status=404)
        game = get_or_create_game(game_data)
        return Response(GameSerializer(game).data)