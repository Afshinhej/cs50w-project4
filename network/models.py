from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    def serialize(self):
        return {
            "id": self.id,
            "username": self.username
        }

class Post(models.Model):
    user = models.ForeignKey("User", on_delete=models.CASCADE, related_name="posts")
    body = models.TextField(blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    
    def countlikes(self):
        likes = Like.objects.filter(post=self)
        count = len(likes)
        return count
    
    def liker(self):
        likes = Like.objects.filter(post=self)
        likers = likes.user
        return likers
        
    def serialize(self):
        return {
            "id": self.id,
            "user": self.user.username,
            "body": self.body,
            "timestamp": self.timestamp.strftime("%b %d %Y, %I:%M %p"),
            "likes": self.countlikes(),
            "user_id": self.user.id,
            "likers": [liker.user.id for liker in self.likers.all()]
        }
        
    def __str__(self):
        return f"{self.id}: {self.user} @ {self.timestamp.strftime('%b %d %Y, %I:%M %p')}"


class Like(models.Model):
    user = models.ForeignKey("User", on_delete=models.CASCADE, related_name="favorite")
    post = models.ForeignKey("Post", on_delete=models.CASCADE, related_name="likers")
    
    class Meta:
        unique_together = ('user', 'post',)
    
    def __str__(self):
        return f'{self.user} likes {self.post.id}'
