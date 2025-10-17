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
    user_logs = GameLog.objects.filter(user=request.user)

    if status_filter:
        user_logs = user_logs.filter(status=status_filter)

    serializer = GameLogSerializer(user_logs, many=True)
    return Response({"logs": serializer.data})


@api_view(["GET"])
def search_games(request):
    query = request.GET.get("q")
    page = request.GET.get("page", 1)

    if not query:
        return Response({"error": "Query parameter 'q' required"}, status=400)

    # Check DB first
    games = Game.objects.filter(name__icontains=query)
    if games.exists():
        serializer = GameSerializer(games, many=True)
        return Response({"results": serializer.data, "source": "db"})

    # If not in DB, fetch from RAWG
    data = get_games(search_query=query, page=page)
    results = []

    for g in data.get("results", []):
        # Save to DB for caching
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

    return Response({"results": results, "source": "rawg"})


@api_view(["POST"])
def register_user(request):
    username = request.data.get("username")
    email = request.data.get("email")
    password = request.data.get("password")

    if not username or not password:
        return Response({"error": "Username and password required"}, status=status.HTTP_400_BAD_REQUEST)

    if User.objects.filter(username=username).exists():
        return Response({"error": "Username already exists"}, status=status.HTTP_400_BAD_REQUEST)

    user = User.objects.create_user(username=username, email=email, password=password)
    user.save()

    # Generate JWT token
    refresh = RefreshToken.for_user(user)
    return Response({
        "user": {
            "id": user.id,
            "username": user.username,
            "email": user.email
        },
        "refresh": str(refresh),
        "access": str(refresh.access_token)
    }, status=status.HTTP_201_CREATED)


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
        },
    )

    serializer = GameLogSerializer(log)
    return Response(serializer.data, status=status.HTTP_201_CREATED)


@api_view(["GET"])
def games_list(request):
    search = request.GET.get("search")
    page = request.GET.get("page", 1)
    data = get_games(search_query=search, page=page)
    return Response(data)
