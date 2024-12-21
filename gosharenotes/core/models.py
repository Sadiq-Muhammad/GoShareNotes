from django.db import models
from django.utils.timezone import now
import datetime

class Note(models.Model):
    PUBLIC = 'public'
    SEMI_PUBLIC = 'semi-public'
    PRIVATE = 'private'

    PRIVACY_CHOICES = [
        (PUBLIC, 'Public'),
        (SEMI_PUBLIC, 'Semi-public'),
        (PRIVATE, 'Private'),
    ]

    title = models.CharField(max_length=200, unique=True)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    privacy = models.CharField(max_length=20, choices=PRIVACY_CHOICES, default=PUBLIC)
    password = models.CharField(max_length=128)

    def is_recent(self):
        """Check if note is the default and resets every 30 minutes."""
        return (now() - self.created_at) < datetime.timedelta(minutes=30)

    def __str__(self):
        return self.title
