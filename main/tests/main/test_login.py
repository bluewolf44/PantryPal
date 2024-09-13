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


