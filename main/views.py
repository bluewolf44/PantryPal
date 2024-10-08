from django.core.serializers import serialize
from django.shortcuts import render, redirect, get_object_or_404
from django.http import HttpResponse, JsonResponse
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.http import require_POST
from django.forms.models import model_to_dict

from django.db import IntegrityError

from .models import Recipe, Shared, Profile
from .forms import RecipeForm, SharedRecipeForm

from main.forms import *
from main.models import Ingredient, Recipe, Required
import google.generativeai as genai
import os
import json


def index_page(request):
    return render(request, "dist/index.html")

# doesnt_matter to so recipes_details work in urls
def index_page_with_parms(request, doesnt_matter):
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

        profile = Profile.objects.create(
            user = user
        )

        profile.save()

        login(request, user)
        return JsonResponse({"detail": "Account created and logged in successfully!"}, status=201)

    except IntegrityError:
        return JsonResponse({"detail": "Failed to create account. Please try again later."}, status=500)

    except json.JSONDecodeError:
        return JsonResponse({"detail": "Invalid JSON format"}, status=400)


def get_current_user_view(request):
    if not request.user.is_authenticated:
        return JsonResponse({"error": "You aren't logged in"}, status=401)
    user = model_to_dict(request.user)
    profile_model = get_object_or_404(Profile, user=request.user)
    profile = model_to_dict(profile_model)
    profile['picture'] = profile_model.picture.url
    user_profile = {
        'user': user,
        'profile':profile
    }

    return JsonResponse(user_profile, safe=False)

@require_POST
def update_user_details_view(request):
    if not request.user.is_authenticated:
        return JsonResponse({"error": "You aren't logged in"}, status=401)
    user = request.user
    body = request.POST
    profile = user.profile

    user.username = body.get('username', user.username)
    user.email = body.get('email', user.email)
    password = body.get('password')
    if password:
        user.set_password(password)

    user.save()


    if 'picture' in request.FILES:
        profile.picture = request.FILES['picture']

    profile.save()

    return JsonResponse({"details": "Successfully updated user details", "body": body})


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
    return JsonResponse({"detail": response.text})

# Add View for creating a recipe
# Note: This is for the manual creation of the recipe, see Saved Recipe for the method to save the AI Generated Recipe.
@require_POST
def create_recipe(request):
    if not request.user.is_authenticated:
        return JsonResponse({"detail": "You aren't log in"}, status=401)

    body = RecipeForm(request.POST, request.FILES)

    if not body.is_valid():
        return JsonResponse({"detail": "form missing values"}, status=400)

    recipe = Recipe.objects.create(
        recipeName=body.cleaned_data["recipeName"],
        user=request.user,
        recipe=body.cleaned_data["recipe"],
        picture=body.cleaned_data["picture"]
    )

    # Get all word from the query and remove common punctuation
    words = body.cleaned_data["recipe"].replace("*", "").replace('"', "").replace(",","").split(" ")


    ingredients = Ingredient.objects.filter(user=request.user)
    # ingredients names, Single word per index
    ingredient_names = []
    # The objects for the ingredients names, e.g the object in index 1 is the same of ingredient_names index 1
    ingredient_index = []
    for ingredient in ingredients:
        # Removing comma
        for name in ingredient.ingredientName.replace(",", " ").split(" "):
            #adding name and the object to each list
            ingredient_names.append(name)
            ingredient_index.append(ingredient)

    # The ingredient that the system has found
    ingredients_in_query = []
    for w in words:
        try:
            # Find if the word in the ingredient_names if not throws ValueError
            index = ingredient_names.index(w)
            #Check if that object already in there
            if not ingredient_index[index] in ingredients_in_query:
                ingredients_in_query.append(ingredient_index[index])
        except ValueError:
            continue

    # Created the required object
    for ingredient in ingredients_in_query:
        required = Required.objects.create(
            recipe=recipe,
            ingredient=ingredient
        )
        required.save()

    recipe.save()

    return HttpResponse(status=201)

# Add view for getting a recipe
def get_user_recipes(request):
    if not request.user.is_authenticated:
        return JsonResponse({"detail": "You aren't log in"}, status=401)
    user = request.user

    return JsonResponse(serialize("json", Recipe.objects.filter(user=user)), safe=False)

@require_POST
def save_recipe(request):
    if not request.user.is_authenticated:
        return JsonResponse({"detail": "You aren't log in"}, status=401)
    user = request.user

    body = json.loads(request.body)

    recipe = Recipe.objects.create(
        recipeName=body.get("recipeName"),
        user=user,
        recipe=body.get("recipe"),
    )
    recipe.save()

    return HttpResponse(status=201)

def delete_recipe_view(request, recipe_id):
    if not request.method == "DELETE":
        return HttpResponse(status=404)

    if not request.user.is_authenticated:
        return JsonResponse({"detail": "You aren't log in"}, status=401)

    user = request.user
    recipe = get_object_or_404(Recipe,id=recipe_id, user=user)
    recipe.delete()

    return JsonResponse({"detail": "Recipe deleted successfully"}, status=200)

def get_user_recipe_by_id(request, recipe_id):
    if not request.method == "GET":
        return HttpResponse(status=404)

    if not request.user.is_authenticated:
        return JsonResponse({"detail": "You aren't log in"}, status=401)

    user = request.user
    return JsonResponse(serialize("json", Recipe.objects.filter(user=user, id=recipe_id)), safe=False)

def shared_recipe_view(request, user_id):

    pass

# this code will receive json of user_ids list, and recipe id
@require_POST
def share_recipe_view(request):

    if not request.user.is_authenticated:
        return JsonResponse({"error": "You aren't logged in"}, status = 401)
    user = request.user

    body = SharedRecipeForm(request.POST)

    if not body.is_valid():
        return JsonResponse({"error": body.errors, "POSTreq": request.POST}, status=400)

    user_ids = json.loads(body.cleaned_data['user_ids'])
    recipe_id = body.cleaned_data['recipe_id']

    recipients = User.objects.filter(pk__in=user_ids)
    recipe = Recipe.objects.get(pk=recipe_id)
    for recipient in recipients:
        shared_recipe = Shared.objects.create(
            recipeOwner = user,
            recipeName = recipe,
            userShared = recipient
        )
        shared_recipe.save()

    return JsonResponse({"message": "Recipe shared successfully"}, status=201)

        # class Shared(models.Model):
        #     recipeOwner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='recipeOwner')
        #     recipeShared = models.ForeignKey(Recipe, on_delete=models.CASCADE)
        #     userShared = models.ForeignKey(User, on_delete=models.CASCADE, related_name="userShared")
        #     feedback = models.CharField(max_length=200)

# this code will post the feedback to the shared recipe
@require_POST
def feedback_shared_recipe_view(request, recipe_id):
    if not request.user.is_authenticated:
        return JsonResponse({"error": "You aren't logged in"}, status=401)

    try:
        body = json.loads(request.body)
        feedback = body.get("feedback")

        if not feedback:
            return JsonResponse({"error": "Feedback cannot be empty"}, status=400)

        # Fetch the shared recipe
        shared_recipe = get_object_or_404(Shared, recipeShared__id=recipe_id, userShared=request.user)

        # Update the feedback field
        shared_recipe.feedback = feedback
        shared_recipe.save()

        return JsonResponse({"detail": "Feedback submitted successfully!"}, status=200)

    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON format"}, status=400)

def get_recipes_received_view(request):
    if not request.user.is_authenticated:
        return JsonResponse({"error": "You aren't logged in"}, status=401)

    user = request.user
    shared = Shared.objects.filter(userShared=user).select_related('recipeOwner', 'recipeName').all()


    shared_list = []
    for item in shared:
        shared_dict = model_to_dict(item)
        profile = Profile.objects.get(user=item.recipeOwner)
        shared_dict['recipeOwner'] = model_to_dict(item.recipeOwner)
        shared_dict['profile'] = model_to_dict(profile)
        # I added this part to convert "picture" to string directory.
        shared_dict['profile']['picture'] = str(shared_dict['profile']['picture'])
        shared_dict['recipeName'] = model_to_dict(item.recipeName)
        # I added this part to convert "picture" to string directory.
        shared_dict['recipeName']['picture'] = str(shared_dict['recipeName']['picture'])
        shared_dict['userShared'] = model_to_dict(item.userShared)
        shared_list.append(shared_dict)

    return JsonResponse(shared_list, safe=False)

def get_feedback_for_recipe(request, recipe_id):
    if not request.user.is_authenticated:
        return JsonResponse({"error": "You aren't logged in"}, status=401)
    user = request.user
    recipe = get_object_or_404(Recipe, pk=recipe_id, user=request.user)
    shared = Shared.objects.filter(recipeOwner=user, recipeName=recipe).all()

    feedback_list = []
    for item in shared:
        profile = Profile.objects.get(user=item.userShared)
        shared_dict = model_to_dict(item, fields=['feedback'])
        shared_dict['userShared'] = model_to_dict(item.userShared, fields=['id', 'username'])
        shared_dict['profile'] = model_to_dict(profile, fields=['picture'])
        # I added this part to convert "picture" to string directory.
        shared_dict['profile']['picture'] = str(shared_dict['profile']['picture'])
        feedback_list.append(shared_dict)

    if not feedback_list:
        return JsonResponse([], safe=False)

    return JsonResponse(feedback_list, safe=False)

@require_POST
def save_to_my_recipes_view(request, recipe_id):
    if not request.user.is_authenticated:
        return JsonResponse({"error": "You aren't logged in"}, status=401)

    user = request.user
    recipe = get_object_or_404(Recipe, pk=recipe_id)
    clone_recipe = Recipe.objects.create(
        recipeName = recipe.recipeName,
        user = user,
        recipe = recipe.recipe,
        picture = recipe.picture
    )
    clone_recipe.save()

    return JsonResponse({"detail": "Saved to my recipes successfully"}, status=201)

def delete_recipe_received_view(request, shared_id):
    if not request.user.is_authenticated:
        return JsonResponse({"error": "You aren't logged in"}, status=401)

    shared_recipe = get_object_or_404(Shared, pk=shared_id)

    shared_recipe.delete()

    return JsonResponse({"detail": "Ingredient deleted successfully"}, status=200)


@require_POST
def update_recipe(request, recipe_id):
    if not request.user.is_authenticated:
        return JsonResponse({"error": "You aren't logged in"}, status=401)

    # Get the recipe by id, ensuring it belongs to the logged-in user
    recipe = get_object_or_404(Recipe, pk=recipe_id, user=request.user)

    # Use RecipeForm, passing in request.POST and request.FILES along with the instance
    form = RecipeForm(request.POST, request.FILES, instance=recipe)

    if form.is_valid():
        form.save()  # This will save the updated recipe
        return JsonResponse({'detail': 'Recipe updated successfully'}, status=200)
    else:
        return JsonResponse({"error": "Invalid form data", "details": form.errors}, status=400)


# Get all ingredients which is used by recipe_id using Required
def get_ingredients_by_required(request, recipe_id):
    if not request.user.is_authenticated:
        return JsonResponse({"error": "You aren't logged in"}, status=401)

    recipe = get_object_or_404(Recipe, pk=recipe_id, user=request.user)
    requireds = Required.objects.filter(recipe=recipe)
    # Finally get all using Required using the foreign key
    ingredients = []
    for required in requireds:
        ingredients.append(required.ingredient)

    return JsonResponse(serialize("json", ingredients), safe=False)

# This is used for markAsCreated where it will update the database with the new amounts
@require_POST
def update_ingredient_by_amount(request):
    if not request.user.is_authenticated:
        return JsonResponse({"error": "You aren't logged in"}, status=401)

    body = json.loads(request.body)
    # Check all the data is there
    for ingredient in body:
        if ingredient.get("amount") is None or ingredient.get("pk") is None:
            return JsonResponse({"detail": "Missing required fields"}, status=400)

    # Updates the database
    for ingredient in body:
        ing = get_object_or_404(Ingredient, pk=ingredient.get("pk"))
        ing.amount = ingredient.get("amount")
        ing.save()

    return JsonResponse({"detail": "update ingredient successfully"}, status=201)


# This will be used for getting all users (excluding you) in a list form for the sharerecipe modal, and recipe details.
def get_all_users_view(request):
    if not request.user.is_authenticated:
        return JsonResponse({"error": "You aren't logged in"}, status=401)

    user = request.user
    users = User.objects.exclude(id=user.id)
    profiles = Profile.objects.filter(user__in=users)

    user_profiles_list = []
    for user, profile in zip(users, profiles):
        user_data = model_to_dict(user, fields=['id', 'username', 'email'])
        profile_data = model_to_dict(profile, fields=['picture'])
        user_data['profile'] = profile_data
        user_data['profile']['picture'] = str(user_data['profile']['picture'])
        user_profiles_list.append(user_data)

    return JsonResponse(user_profiles_list, safe=False)
