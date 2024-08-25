from django.shortcuts import render, redirect
from django.http import HttpResponse, JsonResponse

import json
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.http import require_POST
from django.db import IntegrityError

from main.models import Ingredient


def index_page(request):
    return render(request, "dist/index.html")

@require_POST
def create_account(request):
    try:
        body = json.loads(request.body)
        username = body.get("username")
        password = body.get("password")
        email = body.get("email")

        if not username or not password or not email:
            return JsonResponse({"detail": "Missing required fields"}, status=400)

        if User.objects.filter(username=username).exists():
            return JsonResponse({"detail": "Username already taken"}, status=409)

        user = User.objects.create_user(username=username, password=password, email=email)
        user.save()

        login(request, user)
        return JsonResponse({"detail": "Account created and logged in successfully!"}, status=201)

    except IntegrityError:
        return JsonResponse({"detail": "Failed to create account. Please try again later."}, status=500)

    except json.JSONDecodeError:
        return JsonResponse({"detail": "Invalid JSON format"}, status=400)    


@require_POST
def api_login(request):
    body = json.loads(request.body)
    username = body.get("username")
    password = body.get("password")

    if username is None or password is None:
        return HttpResponse("invalid request", status=400)

    user = authenticate(username=username, password=password)

    if user is None:
        return HttpResponse("invalid login", status=409)

    login(request, user)
    return JsonResponse({"details": "Succesfully logged in!"})

def logout_view(request):
    if not request.user.is_authenticated:
        return JsonResponse({"detail": "You aren't logged in"}, status=400)
    
    logout(request)
    return JsonResponse({"detail: Successfully logged out"})

def delete_account_view(request):
    if not request.user.is_authenticated:
        return JsonResponse({"detail": "You aren't logged in"}, status=400)
    user = request.user
    logout(request)
    user.delete()
    return JsonResponse({"detail": "User deleted successfully"})
    

@ensure_csrf_cookie
def session_view(request):
    if not request.user.is_authenticated:
        return JsonResponse({"isAuthenticated": False})
    return JsonResponse({"isAuthenticated": True})


def whoami_view(request):
    if not request.user.is_authenticated:
        return JsonResponse({"isAuthenticated": False})
    return JsonResponse({"username": request.user.username})


@require_POST
def create_ingredient(request):
    if not request.user.is_authenticated:
        return JsonResponse({"detail": "You aren't log in"}, status=401)
    body = json.loads(request.body)

    ingredinet = Ingredient.object.create(
        ingredientName=body.get("ingredientName"),
        user=request.user,
        amount=body.get("amount"),
        describe=body.get("describe"),
        # picture=body.get("picture"), TODO
        liquid=body.get("liquid")
    )
    ingredinet.save()

    return  HttpResponse(status=201)
