from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.models import User
from .models import Game, GameLog, UserProfile, Friendship

# Custom admin classes for better display
class GameAdmin(admin.ModelAdmin):
    list_display = ('name', 'rawg_id', 'released', 'rating', 'platform')
    list_filter = ('released', 'rating', 'platform')
    search_fields = ('name', 'rawg_id')
    readonly_fields = ('rawg_id',)
    ordering = ('name',)

class GameLogAdmin(admin.ModelAdmin):
    list_display = ('user', 'game', 'status', 'hours_played', 'rating', 'created_at')
    list_filter = ('status', 'created_at', 'platform')
    search_fields = ('user__username', 'game__name', 'review')
    readonly_fields = ('created_at',)
    date_hierarchy = 'created_at'
    ordering = ('-created_at',)

class UserProfileInline(admin.StackedInline):
    model = UserProfile
    can_delete = False
    verbose_name_plural = 'Profile'

class CustomUserAdmin(UserAdmin):
    inlines = (UserProfileInline,)
    list_display = ('username', 'email', 'date_joined', 'is_staff')
    list_filter = ('is_staff', 'is_superuser', 'is_active', 'date_joined')
    search_fields = ('username', 'email')

class FriendshipAdmin(admin.ModelAdmin):
    list_display = ('from_user', 'to_user', 'accepted', 'created_at')
    list_filter = ('accepted', 'created_at')
    search_fields = ('from_user__username', 'to_user__username')
    readonly_fields = ('created_at',)
    ordering = ('-created_at',)

class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'location', 'created_at', 'updated_at')
    list_filter = ('created_at', 'updated_at')
    search_fields = ('user__username', 'bio', 'location')
    readonly_fields = ('created_at', 'updated_at')
    ordering = ('-created_at',)

# Unregister the default User admin and register with custom admin
admin.site.unregister(User)
admin.site.register(User, CustomUserAdmin)

# Register your models
admin.site.register(Game, GameAdmin)
admin.site.register(GameLog, GameLogAdmin)
admin.site.register(UserProfile, UserProfileAdmin)
admin.site.register(Friendship, FriendshipAdmin)

# Optional: Customize admin site header and title
admin.site.site_header = "Checkpoint Gaming Platform Administration"
admin.site.site_title = "Checkpoint Admin"
admin.site.index_title = "Welcome to Checkpoint Administration"