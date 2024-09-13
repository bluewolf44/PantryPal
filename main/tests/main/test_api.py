import pytest
from django.contrib.auth import authenticate
from django.contrib.auth.hashers import make_password
from django.test import TestCase
import pytest

from django.urls import reverse
from django.test import Client
import json as Json

from main.models import Ingredient

pytestPantryPal = pytest.mark.django_db

@pytestPantryPal
def test_delete_ingredient(user_factory, ingredient_factory):
    c = Client()
    user = user_factory(username="dave", password=make_password("password123"))
    ingredient = ingredient_factory(user=user, ingredientName="cheese")
    url = reverse("api_delete_ingredients", args=[ingredient.id])

    assert c.delete(url).status_code == 401
    c.force_login(user)

    response = c.delete(url)
    assert response.status_code == 200
    assert len(Ingredient.objects.filter(id=ingredient.id)) == 0

    # Test deleting an ingredient that doesn't exist
    url = reverse("api_delete_ingredients", args=[9999])
    response = c.delete(url)
    assert response.status_code == 404  # Assuming 404 is returned for not found

    # Test deleting an ingredient that belongs to another user
    other_user = user_factory(username="jeff", password=make_password("password123"))
    other_ingredient = ingredient_factory(user=other_user, ingredientName="milk")
    url = reverse("api_delete_ingredients", args=[other_ingredient.id])
    response = c.delete(url)
    assert response.status_code == 404

@pytestPantryPal
def test_edit_ingredient(user_factory, ingredient_factory):
    c = Client()
    user = user_factory(username="dave", password=make_password("password123"))
    ingredient = ingredient_factory(user=user, ingredientName="cheese", amount=500, describe="yellow", liquid=False)
    url = reverse("api_edit_ingredient",args=[ingredient.id])
    assert c.post(url).status_code == 401
    c.force_login(user)

    # Test successful ingredient edit
    response = c.post(url, {
        "ingredientName": "blue cheese",
        "amount": 600,
        "describe": "blue mold cheese",
        "liquid": False
    }, files={"picture":""})
    assert response.status_code == 202
    updated_ingredient = Ingredient.objects.get(id=ingredient.id)
    assert updated_ingredient.ingredientName == "blue cheese"
    assert updated_ingredient.amount == 600
    assert updated_ingredient.describe == "blue mold cheese"
    assert updated_ingredient.liquid == False

    url = reverse("api_edit_ingredient",args=[9999])
    # Test editing an ingredient that doesn't exist
    response = c.post(url, {
        "ingredientName": "",
        "amount": 1,
        "describe": "",
        "liquid": True
    }, files={"picture":""})
    assert response.status_code == 404

    # Test editing an ingredient that belongs to another user
    other_user = user_factory(username="jeff", password=make_password("password1234"))
    other_ingredient = ingredient_factory(user=other_user, ingredientName="milk")
    url = reverse("api_edit_ingredient",args=[other_ingredient.id])
    response = c.post(url, {
        "ingredientName": "oat milk",
        "amount": 1,
        "describe": "",
        "liquid": True
    }, files={"picture":""})
    assert response.status_code == 404