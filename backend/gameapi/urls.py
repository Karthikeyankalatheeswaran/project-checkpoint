from django.urls import path
from . import views
from .views import MyTokenObtainPairView

urlpatterns = [
    # Auth
    path("register/", views.register_user, name="register_user"),
    path('token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    
    # Games
    path("games/", views.games_list, name="games_list"),
    path("games/<int:rawg_id>/", views.get_game_detail, name="get_game_detail"),
    path("search-games/", views.search_games, name="search_games"),
    
    # Game Logs
    path("log-game/", views.log_game, name="log_game"),
    path("log-game/<int:log_id>/edit/", views.edit_game_log, name="edit_game_log"),
    path("log-game/<int:log_id>/delete/", views.delete_game_log, name="delete_game_log"),
    path("dashboard/", views.user_dashboard, name="user_dashboard"),
    
    # User Profiles
    path('profile/', views.get_user_profile, name='get_current_user_profile'),
    path('profile/update/', views.update_user_profile, name='update_user_profile'),
    path('profile/<str:username>/', views.get_user_profile, name='get_user_profile'),
    path('profile/<str:username>/logs/', views.get_user_game_logs, name='get_user_game_logs'),
    
    # Friends System
    path('friends/search/', views.search_users, name='search_users'),
    path('friends/send-request/<str:username>/', views.send_friend_request, name='send_friend_request'),
    path('friends/accept-request/<int:friendship_id>/', views.accept_friend_request, name='accept_friend_request'),
    path('friends/reject-request/<int:friendship_id>/', views.reject_friend_request, name='reject_friend_request'),
    path('friends/remove/<str:username>/', views.remove_friend, name='remove_friend'),
    path('friends/', views.get_friends, name='get_friends'),
    path('friends/pending/', views.get_pending_requests, name='get_pending_requests'),
    path('friends/status/<str:username>/', views.get_friend_status, name='get_friend_status'),
]