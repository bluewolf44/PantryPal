from django.core.serializers import serialize
from django.shortcuts import render, redirect, get_object_or_404
from django.http import HttpResponse, JsonResponse
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.http import require_POST
from django.db import IntegrityError

from main.forms import *
from main.models import Ingredient, Recipe
import google.generativeai as genai
import os
import json


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
        return JsonResponse({"details": "invalid request"}, status=400)

    user = authenticate(username=username, password=password)

    if user is None:
        return JsonResponse({"details": "invalid login"}, status=401)

    login(request, user)
    return JsonResponse({"details": "Successfully logged in!"})


def logout_view(request):
    if not request.user.is_authenticated:
        return JsonResponse({"detail": "You aren't logged in"}, status=400)

    logout(request)
    return JsonResponse({"details": "Successfully logged out"})


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

    body = IngredientsForm(request.POST, request.FILES)

    if not body.is_valid():
        return JsonResponse({"detail": "form missing values"}, status=400)

    ingredient = Ingredient.objects.create(
        ingredientName=body.cleaned_data["ingredientName"],
        user=request.user,
        amount=int(body.cleaned_data["amount"]),
        describe=body.cleaned_data["describe"],
        picture=body.cleaned_data["picture"],
        liquid=body.cleaned_data["liquid"]
    )
    ingredient.save()

    return HttpResponse(status=201)


# ingredient_id is obtained from urls.py matching ingredient_id.
def delete_ingredient_view(request, ingredient_id):
    if not request.method == "DELETE":
        return HttpResponse(status=404)

    if not request.user.is_authenticated:
        return JsonResponse({"detail": "You aren't log in"}, status=401)
    user = request.user

    ingredient = get_object_or_404(Ingredient,id=ingredient_id, user=user)

    ingredient.delete()

    return JsonResponse({"detail": "Ingredient deleted successfully"}, status=200)


def edit_ingredient_view(request, ingredient_id):
    if not request.user.is_authenticated:
        return JsonResponse({"error": "You aren't logged in"}, status=401)
    user = request.user

    body = IngredientsForm(request.POST, request.FILES)
    ingredient = get_object_or_404(Ingredient, id=ingredient_id, user=user)

    if not body.is_valid():
        return JsonResponse({"error": "form missing values"}, status=400)

    ingredient.ingredientName = body.cleaned_data["ingredientName"]

    if body.cleaned_data["picture"]:
        ingredient.picture = body.cleaned_data["picture"]
    ingredient.describe = body.cleaned_data["describe"]
    ingredient.amount = int(body.cleaned_data["amount"])
    ingredient.liquid = body.cleaned_data["liquid"]
    ingredient.save();

    return JsonResponse({"detail": "Ingredient updated successfully"}, status=202)


def get_user_ingredients(request):
    if not request.user.is_authenticated:
        return JsonResponse({"detail": "You aren't log in"}, status=401)
    user = request.user

    return JsonResponse(serialize("json", Ingredient.objects.filter(user=user)), safe=False)

#the baking_type is the baking your doing e.g cake,cup cakes
def ai_recipe(request,baking_type):
    if not request.user.is_authenticated:
        return JsonResponse({"detail": "You aren't log in"}, status=401)
    #Uses the api in .env
    api_key = os.environ.get("GEMINI_API_KEY", False)
    if not api_key:
        JsonResponse({"error": "api_key not correctly place in .env"}, status=501)
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel("gemini-1.5-flash")

    #adds all ingredients into a string to be added into the ai
    ingredients = ""
    user = request.user
    for i in Ingredient.objects.filter(user=user):
        ingredients += i.ingredientName+", "

    # The main request
    response = model.generate_content("give me a "+baking_type+" recipe only using the following ingredients:"+ingredients)
    print(response.candidates[0].safety_ratings)
    return JsonResponse({"detail": response.text})

# Add View for creating a recipe
def create_recipe(request):
    if not request.user.is_authenticated:
        return JsonResponse({"detail": "You aren't log in"}, status=401)

    body = RecipeForm(request.POST,request.FILES)

    if not body.is_valid():
        return JsonResponse({"detail": "form missing values"}, status=400)

    recipe = Recipe.objects.create(
        recipeName=body.cleaned_data["recipeName"],
        user=request.user,
        recipe=body.cleaned_data["recipe"],
        picture=body.cleaned_data["picture"]
    )
    recipe.save()

    return HttpResponse(status=201)

# Add view for getting a recipe
def get_user_recipes(request):
    if not request.user.is_authenticated:
        return JsonResponse({"detail": "You aren't log in"}, status=401)
    user = request.user

    return JsonResponse(serialize("json", Recipe.objects.filter(user=user)), safe=False)
