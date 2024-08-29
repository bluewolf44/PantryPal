from django.contrib.auth import authenticate
from django.contrib.auth.hashers import make_password
from django.test import TestCase
import pytest
# Create your tests here.
from django.urls import reverse
from django.test import Client

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
    assert c.post(url,{}, content_type="application/json").status_code == 400
    assert c.post(url,{"ingredientName":"cheese","amount":"500","describe":"yellow","picture":"cheese.jpg","liquid":False},content_type="application/json").status_code == 201
    assert len(Ingredient.objects.filter(ingredientName="cheese",amount=500,describe="yellow",liquid=False)) == 1 #add picture when addded




