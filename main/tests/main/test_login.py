import json

from django.contrib.auth import authenticate
from django.contrib.auth.hashers import make_password
from django.test import TestCase
import pytest
# Create your tests here.
from django.urls import reverse
from django.test import Client
import json as Json

from main.models import Ingredient

pytestPantryPal = pytest.mark.django_db


@pytestPantryPal
class TestLogin:
    def test_str_return(self, user_factory):
        user = user_factory(username="postgres")
        expected_string = "postgres"
        assert user.__str__() == expected_string and user.__str__() != "postgres1"


@pytestPantryPal
def test_login_api(user_factory):
    c = Client()
    url = reverse('api_login')
    user_factory(username="dave", password=make_password("password123"))
    assert c.post(url, content_type="application/json").status_code == 400
    assert c.post(url, {"password": "help", "username": "dave"}, content_type="application/json").status_code == 401
    assert c.post(url, {"password": "password123", "username": "dave"}, content_type="application/json").status_code == 200


@pytestPantryPal
def test_logout_api(user_factory):
    c = Client()
    url = reverse('api_logout')
    assert c.get(url).status_code == 400
    user = user_factory(username="dave", password=make_password("password123"))
    c.force_login(user)
    assert c.get(url).status_code == 200


@pytestPantryPal
def test_create_ingredient_api(user_factory):
    c = Client()
    url = reverse("api_create_ingredient")
    assert c.post(url).status_code == 401
    user = user_factory(username="dave", password=make_password("password123"))
    c.force_login(user)
    assert c.post(url, {}, content_type="application/json").status_code == 400
    assert c.post(url, {"ingredientName": "cheese", "amount": "500", "describe": "yellow", "picture": "cheese.jpg", "liquid": False}, content_type="application/json").status_code == 201
    assert len(Ingredient.objects.filter(ingredientName="cheese", amount=500, describe="yellow", liquid=False)) == 1  #add picture when addded


@pytestPantryPal
def test_get_user_ingredients(user_factory, ingredient_factory):
    c = Client()
    url = reverse("api_get_ingredients")
    assert c.get(url).status_code == 401
    user = user_factory(username="dave", password=make_password("password123"))
    c.force_login(user)
    ingredient_factory(user=user, ingredientName="cheese")
    ingredient_factory(user=user, ingredientName="milk")

    other = user_factory(username="jeff", password=make_password("password123"))
    ingredient_factory(user=other, ingredientName="flour")

    response = c.get(url)

    assert response.status_code == 200
    json = Json.loads(response.json())

    for j in json:
        assert j["fields"] == {"ingredientName": "cheese", "user": 5, "amount": 2, "describe": "I have two slices of cheese", "picture": "", "liquid":False} or j["fields"] == {"ingredientName": "milk", "user": 5, "amount": 2, "describe": "I have two slices of cheese", "picture": "", "liquid": False}
    assert len(json) == 2
    assert json[0] != json[1]

@pytestPantryPal
def test_edit_ingredient(user_factory, ingredient_factory):
    c = Client()
    url = reverse("api_edit_ingredient")
    assert c.post(url).status_code == 401
    user = user_factory(username="dave", password=make_password("password123"))
    c.force_login(user)
    ingredient = ingredient_factory(user=user, ingredientName="cheese", amount=500, describe="yellow", liquid=False)

    # Test successful ingredient edit 
    response = c.post(url, {
        "ingredientID": ingredient.id,
        "ingredientName": "blue cheese",
        "amount": 600,
        "describe": "blue mold cheese",
        "liquid": False
    }, content_type="application/json")
    assert response.status_code == 200
    updated_ingredient = Ingredient.objects.get(id=ingredient.id)
    assert updated_ingredient.ingredientName == "blue cheese"
    assert updated_ingredient.amount == 600
    assert updated_ingredient.describe == "blue mold cheese"
    assert updated_ingredient.liquid == False

    # Test editing an ingredient that doesn't exist
    response = c.post(url, {
        "ingredientID": 9999,
        "ingredientName": "non-existent",
    }, content_type="application/json")
    assert response.status_code == 404
    
    # Test editing an ingredient that belongs to another user
    other_user = user_factory(username="jeff", password=make_password("password123"))
    other_ingredient = ingredient_factory(user=other_user, ingredientName="milk")
    response = c.post(url, {
        "ingredientID": other_ingredient.id,
        "ingredientName": "oat milk"
    }, content_type="application/json")
    assert response.status_code == 403

