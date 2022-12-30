import json
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.shortcuts import render
from django.urls import reverse

from .models import User, Post, Like, Follow


def index(request):
    content = {'users': User.objects.all(), 'active_user': request.user}
    return render(request, "network/index.html", content)


def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "network/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "network/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "network/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "network/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")
    
   
@login_required
def post(request):

    # Submitting a new post must be via POST
    if request.method != "POST":
        return JsonResponse({"error": "POST request required."}, status=400)

    
    # Get contents of post
    data = json.loads(request.body)
    body = data.get("post_body", "")
    user = request.user

    # Create a new post
    
    newPost = Post(user=user, body=body)
    newPost.save()
    
    return JsonResponse({"message": "Post was submitted successfully."}, status=201)
    
    
@login_required
def liking(request):

    # Liking a post must be via POST
    if request.method != "POST":
        return JsonResponse({"error": "POST request required."}, status=400)

    # Get contents of post
    data = json.loads(request.body)
    post_id = data.get("post_id", "")
    user = request.user

    # Create a new like object
    
    post = Post.objects.get(id=post_id)
    like = Like(user=user, post=post)
    like.save()
    
    return JsonResponse({"message": "A post was liked successfully."}, status=201)

    
@login_required
def unliking(request):

    # Unliking a post must be via POST
    if request.method != "POST":
        return JsonResponse({"error": "POST request required."}, status=400)

    # Get contents of post
    data = json.loads(request.body)
    post_id = data.get("post_id", "")
    user = request.user

    # Remove a like object
    
    post = Post.objects.get(id=post_id)
    like = Like.objects.get(user=user, post=post)
    like.delete()
    
    return JsonResponse({"message": "A post was unliked successfully."}, status=201)

def showing_posts(request):    
    posts = Post.objects.all()
    posts = posts.order_by("-timestamp").all()
   
    return JsonResponse([post.serialize() for post in posts], safe=False)

def profile(request, user_id):    
    users = User.objects.all()
    user = users.get(id=user_id)
   
    return JsonResponse([user.serialize()], safe=False)

def profile_posts(request, user_id):
    users = User.objects.all()
    profile = users.get(id=user_id)
    posts = Post.objects.order_by("-timestamp").all()
    posts_from_user = posts.filter(user=profile)
    
    return JsonResponse([post.serialize() for post in posts_from_user], safe=False)

def following_posts(request, user_id):
    users = User.objects.all()
    profile = users.get(id=user_id)
    posts = Post.objects.order_by("-timestamp").all()
    followings_ids = profile.following_list()
    followings_users = [users.get(id=id) for id in followings_ids]
    posts_from_followings = posts.filter(user__in=followings_users)
    
    return JsonResponse([post.serialize() for post in posts_from_followings], safe=False)

@login_required
def follow(request):

    # Following a user must be via POST
    if request.method != "POST":
        return JsonResponse({"error": "POST request required."}, status=400)

    # Get contents of post
    data = json.loads(request.body)
    following_id = data.get("user_id", "")
    action = data.get("action", "")
    user = request.user

    # Create/ delete a new/ previous Follow object
    if action == 'follow':
        following = User.objects.get(id=following_id)
        follow = Follow(follower=user, following=following)
        follow.save()
        return JsonResponse({"message": "A user was followed successfully."}, status=201)
    elif action == 'unfollow':
        following = User.objects.get(id=following_id)
        follow = Follow.objects.get(follower=user, following=following)
        follow.delete()
        return JsonResponse({"message": "A user was unfollowed successfully."}, status=201)
        
    