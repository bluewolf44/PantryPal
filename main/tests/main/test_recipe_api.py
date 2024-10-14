import pytest
import json

from django.contrib.auth.hashers import make_password
from django.urls import reverse
from django.test import Client
from django.core.serializers import serialize

from main.models import *

pytestPantryPal = pytest.mark.django_db


@pytestPantryPal
def test_save_recipe(user_factory):
    c = Client()
    url = reverse("api_save_recipe")
    assert c.post(url).status_code == 401  # Not logged in

    user = user_factory(username="dave", password=make_password("password123"))
    c.force_login(user)

    response = c.post(
        url,
        json.dumps({
            "recipeName": "Cheese Scones",
            "recipe": "Two Cups of Flour, One Cup of Cheese, 3 x Eggs"
        }),
        content_type='application/json'
    )

    assert response.status_code == 201
    assert len(
        Recipe.objects.filter(recipeName="Cheese Scones", recipe="Two Cups of Flour, One Cup of Cheese, 3 x Eggs")) == 1


@pytestPantryPal
def test_create_recipe(user_factory, ingredient_factory):
    c = Client()
    url = reverse("api_create_recipe")
    assert c.post(url).status_code == 401  # Not logged in

    user = user_factory(username="dave", password=make_password("password123"))
    c.force_login(user)

    cheese = ingredient_factory(user=user, ingredientName="cheese")
    ingredient_factory(user=user, ingredientName="milk")
    ingredient_factory(user=user, ingredientName="flour")

    assert c.post(url).status_code == 400

    response = c.post(url, {
        "recipeName": "Cheese",
        "recipe": "Make Cheese",
        "picture": "help.png"
    }, files={"picture": ""})

    assert response.status_code == 201
    recipe = Recipe.objects.get(recipeName="Cheese")
    assert recipe.recipeName == "Cheese"
    assert recipe.recipe == "Make Cheese"

    assert len(Required.objects.filter(recipe=recipe)) == 1
    assert Required.objects.filter(recipe=recipe, ingredient=cheese)


@pytestPantryPal
def test_get_user_recipes(user_factory, recipe_factory):
    c = Client()
    url = reverse("api_get_recipes")
    assert c.get(url).status_code == 401  # Not logged in

    user = user_factory(username="dave", password=make_password("password123"))
    c.force_login(user)

    r1 = recipe_factory(user=user, recipeName="Cheese")
    r2 = recipe_factory(user=user, recipeName="Flour")
    r3 = recipe_factory(user=user, recipeName="Milk")

    other = user_factory(username="jeff", password=make_password("password123"))
    recipe_factory(user=other)

    response = c.get(url)
    assert response.status_code == 200
    assert serialize("json", Recipe.objects.filter(user=user)) == response.json()


@pytestPantryPal
def test_save_recipe(user_factory):
    c = Client()
    url = reverse("api_save_recipe")
    assert c.post(url).status_code == 401  # Not logged in

    user = user_factory(username="dave", password=make_password("password123"))
    c.force_login(user)

    assert c.post(url, {}, content_type="application/json").status_code == 400

    response = c.post(url, {
        "recipeName": "Cheese",
        "recipe": "Make Cheese",
        "picture": "help.png"
    }, content_type="application/json")

    assert response.status_code == 201
    recipe = Recipe.objects.get(recipeName="Cheese")
    assert recipe.recipeName == "Cheese"
    assert recipe.recipe == "Make Cheese"


@pytestPantryPal
def test_delete_recipe_view(user_factory, recipe_factory):
    c = Client()
    url = reverse("api_delete_recipe", args=[9999])
    assert c.delete(url).status_code == 401  # Not logged in

    user = user_factory(username="dave", password=make_password("password123"))
    c.force_login(user)

    assert c.get(url).status_code == 404  # Not Delete
    assert c.post(url).status_code == 404  # Not Delete

    recipe1 = recipe_factory(user=user)
    recipe2 = recipe_factory()
    assert c.delete(url).status_code == 404  # No id connected

    url = reverse("api_delete_recipe", args=[recipe2.id])
    assert c.delete(url).status_code == 404  # Not right user
    url = reverse("api_delete_recipe", args=[recipe1.id])
    response = c.delete(url)
    assert response.status_code == 200
    assert len(Recipe.objects.filter(user=user)) == 0


@pytestPantryPal
def test_get_user_recipe_by_id(user_factory, recipe_factory):
    c = Client()
    url = reverse("api_get_recipe_by_id", args=[9999])
    assert c.get(url).status_code == 401  # Not logged in

    user = user_factory(username="dave", password=make_password("password123"))
    c.force_login(user)

    recipe = recipe_factory(user=user, recipeName="Cheese")
    recipe_factory(user=user, recipeName="Milk")
    recipe_factory()

    assert c.post(url).status_code == 404  # Not Delete
    response = c.get(url)
    assert response.status_code == 200
    assert response.json() == "[]"

    url = reverse("api_get_recipe_by_id", args=[recipe.id])
    response = c.get(url)
    assert response.status_code == 200
    assert response.json() == serialize("json", Recipe.objects.filter(user=user, id=recipe.id))

@pytestPantryPal
def save_to_my_recipes_view(user_factory, recipe_factory):
    c = Client()
    url = reverse("api_save_to_my_recipes",args=[9999])
    assert c.post(url).status_code == 401  # Not logged in

    user = user_factory(username="dave", password=make_password("password123"))
    c.force_login(user)

    assert c.post(url).status_code == 404  # not found

    recipe = recipe_factory(recipeName="Cheese")

    url = reverse("api_save_to_my_recipes",args=[recipe.id])

    response = c.post(url)
    assert response.status_code == 201
    assert len(Recipe.objects.filter(user=user)) == 1
