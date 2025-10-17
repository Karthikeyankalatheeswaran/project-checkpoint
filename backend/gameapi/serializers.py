from rest_framework import serializers
from .models import Game, GameLog, UserProfile, Friendship
from django.contrib.auth.models import User
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # Add custom claims
        token['username'] = user.username
        return token

class GameSerializer(serializers.ModelSerializer):
    class Meta:
        model = Game
        fields = "__all__"

class GameLogSerializer(serializers.ModelSerializer):
    game = GameSerializer(read_only=True)

    class Meta:
        model = GameLog
        fields = "__all__"

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['bio', 'location', 'website', 'avatar', 'created_at', 'updated_at']

class UserSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer(read_only=True)
    total_games = serializers.SerializerMethodField()
    total_hours = serializers.SerializerMethodField()
    friends_count = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = ["id", "username", "email", "profile", "total_games", "total_hours", "friends_count"]
    
    def get_total_games(self, obj):
        return GameLog.objects.filter(user=obj).count()
    
    def get_total_hours(self, obj):
        from django.db.models import Sum
        result = GameLog.objects.filter(user=obj).aggregate(total=Sum('hours_played'))
        return result['total'] or 0
    
    def get_friends_count(self, obj):
        return Friendship.objects.filter(
            from_user=obj, 
            accepted=True
        ).count() + Friendship.objects.filter(
            to_user=obj, 
            accepted=True
        ).count()

class FriendshipSerializer(serializers.ModelSerializer):
    from_user = UserSerializer(read_only=True)
    to_user = UserSerializer(read_only=True)
    
    class Meta:
        model = Friendship
        fields = ['id', 'from_user', 'to_user', 'created_at', 'accepted']