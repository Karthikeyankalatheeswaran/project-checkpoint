from django.db import models
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
from django.db.models.signals import post_save
from django.dispatch import receiver

class Game(models.Model):
    rawg_id = models.IntegerField(unique=True)
    name = models.CharField(max_length=255)
    released = models.DateField(null=True, blank=True)
    background_image = models.URLField(null=True, blank=True)
    rating = models.FloatField(null=True, blank=True)
    platform = models.CharField(max_length=100, blank=True, null=True)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.name

class GameLog(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    game = models.ForeignKey(Game, on_delete=models.CASCADE)
    status_choices = [
        ("playing", "Playing"),
        ("completed", "Completed"),
        ("wishlist", "Wishlist"),
        ("dropped", "Dropped"),
    ]
    status = models.CharField(max_length=10, choices=status_choices)
    hours_played = models.FloatField(default=0)
    review = models.TextField(blank=True, null=True)
    rating = models.FloatField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    platform = models.CharField(max_length=100, blank=True, null=True)

    class Meta:
        unique_together = ("user", "game")

    def __str__(self):
        return f"{self.user.username} - {self.game.name}"

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    bio = models.TextField(max_length=500, blank=True, null=True)
    location = models.CharField(max_length=100, blank=True, null=True)
    website = models.URLField(blank=True, null=True)
    avatar = models.URLField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username}'s Profile"

# Automatically create UserProfile when a User is created
@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        UserProfile.objects.get_or_create(user=instance)

@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    instance.profile.save()

class Friendship(models.Model):
    from_user = models.ForeignKey(User, related_name='friendship_requests_sent', on_delete=models.CASCADE)
    to_user = models.ForeignKey(User, related_name='friendship_requests_received', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    accepted = models.BooleanField(default=False)

    class Meta:
        unique_together = ('from_user', 'to_user')
        verbose_name_plural = 'Friendships'

    def clean(self):
        if self.from_user == self.to_user:
            raise ValidationError("Users cannot be friends with themselves.")

    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.from_user.username} -> {self.to_user.username} ({'accepted' if self.accepted else 'pending'})"