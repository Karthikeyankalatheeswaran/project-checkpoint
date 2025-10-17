from django.db import models
from django.contrib.auth.models import User

class Game(models.Model):
    rawg_id = models.IntegerField(unique=True)  # RAWG game ID
    name = models.CharField(max_length=255)
    released = models.DateField(null=True, blank=True)
    background_image = models.URLField(null=True, blank=True)
    rating = models.FloatField(null=True, blank=True)
    platform = models.CharField(max_length=100, blank=True, null=True)

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
