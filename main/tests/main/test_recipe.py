import pytest
import json

from django.contrib.auth.hashers import make_password
from django.urls import reverse
from django.test import Client

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
def test_create_recipe(user_factory,ingredient_factory):
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
