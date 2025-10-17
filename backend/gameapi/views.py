from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import status
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User
from django.db.models import Q, Sum

from .models import Game, GameLog, UserProfile, Friendship
from .serializers import (
    GameSerializer, GameLogSerializer, UserSerializer, 
    UserProfileSerializer, FriendshipSerializer, MyTokenObtainPairSerializer
)
from .services.rawg_api import get_games


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


# ===== AUTHENTICATION VIEWS =====
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


# ===== GAME VIEWS =====
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


# ===== GAME LOG VIEWS =====
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


# ===== USER PROFILE VIEWS =====
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_user_profile(request, username=None):
    try:
        if username:
            user = get_object_or_404(User, username=username)
        else:
            user = request.user
        
        # Get or create profile
        profile, created = UserProfile.objects.get_or_create(user=user)
        
        # Calculate stats
        total_games = GameLog.objects.filter(user=user).count()
        total_hours = GameLog.objects.filter(user=user).aggregate(
            total=Sum('hours_played')
        )['total'] or 0
        
        # Calculate friends count
        friends_count = Friendship.objects.filter(
            (Q(from_user=user) | Q(to_user=user)) & Q(accepted=True)
        ).count()
        
        user_data = {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'profile': {
                'bio': profile.bio,
                'location': profile.location,
                'website': profile.website,
                'avatar': profile.avatar,
                'created_at': profile.created_at,
                'updated_at': profile.updated_at
            },
            'total_games': total_games,
            'total_hours': total_hours,
            'friends_count': friends_count
        }
        
        return Response(user_data)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def update_user_profile(request):
    profile, created = UserProfile.objects.get_or_create(user=request.user)
    serializer = UserProfileSerializer(profile, data=request.data, partial=True)
    
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_user_game_logs(request, username):
    user = get_object_or_404(User, username=username)
    status_filter = request.GET.get("status", "")
    
    user_logs = GameLog.objects.filter(user=user)
    
    if status_filter:
        user_logs = user_logs.filter(status=status_filter)
    
    serializer = GameLogSerializer(user_logs, many=True)
    return Response({"logs": serializer.data})


# ===== FRIENDS SYSTEM VIEWS =====
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def search_users(request):
    query = request.GET.get("q", "").strip()
    
    if not query or len(query) < 2:
        return Response({"error": "Query parameter 'q' is required and must be at least 2 characters."}, status=status.HTTP_400_BAD_REQUEST)
    
    users = User.objects.filter(username__icontains=query).exclude(id=request.user.id)
    
    users_data = []
    for user in users:
        profile = getattr(user, 'profile', None)
        total_games = GameLog.objects.filter(user=user).count()
        total_hours = GameLog.objects.filter(user=user).aggregate(
            total=Sum('hours_played')
        )['total'] or 0
        
        users_data.append({
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'total_games': total_games,
            'total_hours': total_hours,
            'profile': {
                'bio': profile.bio if profile else None,
                'location': profile.location if profile else None,
            }
        })
    
    return Response({"users": users_data})


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def send_friend_request(request, username):
    to_user = get_object_or_404(User, username=username)
    
    if request.user == to_user:
        return Response({"error": "You cannot send a friend request to yourself."}, status=status.HTTP_400_BAD_REQUEST)
    
    # Check if friendship already exists
    existing_friendship = Friendship.objects.filter(
        Q(from_user=request.user, to_user=to_user) | 
        Q(from_user=to_user, to_user=request.user)
    ).first()
    
    if existing_friendship:
        if existing_friendship.accepted:
            return Response({"error": "You are already friends with this user."}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({"error": "Friend request already sent."}, status=status.HTTP_400_BAD_REQUEST)
    
    friendship = Friendship.objects.create(from_user=request.user, to_user=to_user)
    serializer = FriendshipSerializer(friendship)
    return Response(serializer.data, status=status.HTTP_201_CREATED)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def accept_friend_request(request, friendship_id):
    friendship = get_object_or_404(Friendship, id=friendship_id, to_user=request.user)
    
    if friendship.accepted:
        return Response({"error": "Friend request already accepted."}, status=status.HTTP_400_BAD_REQUEST)
    
    friendship.accepted = True
    friendship.save()
    serializer = FriendshipSerializer(friendship)
    return Response(serializer.data)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def reject_friend_request(request, friendship_id):
    friendship = get_object_or_404(Friendship, id=friendship_id, to_user=request.user)
    friendship.delete()
    return Response({"message": "Friend request rejected."}, status=status.HTTP_204_NO_CONTENT)


@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def remove_friend(request, username):
    user = get_object_or_404(User, username=username)
    
    friendship = Friendship.objects.filter(
        Q(from_user=request.user, to_user=user) | 
        Q(from_user=user, to_user=request.user),
        accepted=True
    ).first()
    
    if not friendship:
        return Response({"error": "Friendship not found."}, status=status.HTTP_404_NOT_FOUND)
    
    friendship.delete()
    return Response({"message": "Friend removed successfully."}, status=status.HTTP_204_NO_CONTENT)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_friends(request):
    try:
        # Get accepted friendships where user is either sender or receiver
        friendships = Friendship.objects.filter(
            (Q(from_user=request.user) | Q(to_user=request.user)) & Q(accepted=True)
        )
        
        friends_data = []
        for friendship in friendships:
            if friendship.from_user == request.user:
                friend_user = friendship.to_user
            else:
                friend_user = friendship.from_user
            
            profile = getattr(friend_user, 'profile', None)
            total_games = GameLog.objects.filter(user=friend_user).count()
            total_hours = GameLog.objects.filter(user=friend_user).aggregate(
                total=Sum('hours_played')
            )['total'] or 0
            
            friends_data.append({
                'id': friend_user.id,
                'username': friend_user.username,
                'email': friend_user.email,
                'total_games': total_games,
                'total_hours': total_hours,
                'profile': {
                    'bio': profile.bio if profile else None,
                    'location': profile.location if profile else None,
                }
            })
        
        return Response({"friends": friends_data})
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_pending_requests(request):
    pending_requests = Friendship.objects.filter(to_user=request.user, accepted=False)
    serializer = FriendshipSerializer(pending_requests, many=True)
    return Response({"pending_requests": serializer.data})


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_friend_status(request, username):
    user = get_object_or_404(User, username=username)
    
    friendship = Friendship.objects.filter(
        Q(from_user=request.user, to_user=user) | 
        Q(from_user=user, to_user=request.user)
    ).first()
    
    if friendship:
        if friendship.accepted:
            status_info = {"status": "friends", "friendship_id": friendship.id}
        else:
            if friendship.from_user == request.user:
                status_info = {"status": "request_sent", "friendship_id": friendship.id}
            else:
                status_info = {"status": "request_received", "friendship_id": friendship.id}
    else:
        status_info = {"status": "not_friends"}
    
    return Response(status_info)


# ===== HELPER FUNCTIONS =====
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