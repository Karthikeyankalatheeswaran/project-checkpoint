from django.urls import path
from . import views
from .views import log_game , register_user ,search_games ,user_dashboard ,edit_game_log , delete_game_log ,MyTokenObtainPairSerializer, MyTokenObtainPairView

urlpatterns = [
    path("games/", views.games_list, name="games_list"),
    path("log-game/", log_game, name="log_game"),
    path("register/", register_user, name="register_user"),
    path("search-games/", search_games, name="search_games"),
    path("dashboard/", user_dashboard, name="user_dashboard"),
    path("log-game/<int:log_id>/edit/", edit_game_log, name="edit_game_log"),
    path("log-game/<int:log_id>/delete/", delete_game_log, name="delete_game_log"),
    path("games/<int:rawg_id>/", views.get_game_detail, name="get_game_detail"),
    path('api/token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair')
]
