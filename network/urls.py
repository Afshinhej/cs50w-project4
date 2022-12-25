
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    
    # API Routes
    path("post", views.post, name="post"),
    path("profile/<int:user_id>", views.profile, name="profile"),
    path("profile/<int:user_id>/posts", views.profile_posts, name="profile_posts"),
    path("following/<int:user_id>", views.following, name="following"),
    path("following/<int:user_id>/posts", views.following_posts, name="following_posts"),
    path("posts", views.showing_posts, name="posts")
]
