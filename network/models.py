from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    def follower_list(self):
        return [follower.follower.id for follower in self.follower.all()] #user_id of the followers will be listed
        
    def following_list(self):
        return [following.following.id for following in self.following.all()] #user_id of the followings will be listed 
         
        
    def serialize(self):
        return {
            "id": self.id,
            "username": self.username,
            "follower_list": self.follower_list(),
            "following_list":self.following_list(),
            "follower": len(self.follower_list()),
            "following": len(self.following_list())
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
        likers = [like.user.id for like in likes]
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

class Follow(models.Model):
    follower = models.ForeignKey("User", on_delete=models.CASCADE, related_name="following")
    following = models.ForeignKey("User", on_delete=models.CASCADE, related_name="follower")
    
    class Meta:
        unique_together = ('follower', 'following',)
    
    def __str__(self):
        return f'{self.follower} follows {self.following}'
