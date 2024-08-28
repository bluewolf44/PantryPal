from django.contrib.auth import authenticate
from django.contrib.auth.hashers import make_password
from django.test import TestCase
import pytest
# Create your tests here.
from django.urls import reverse
from django.test import Client

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
    user_factory(username="dave",password=make_password("password123"))
    assert c.post(url,content_type = "application/json").status_code == 400
    assert c.post(url, {"password":"help","username":"dave"},content_type = "application/json").status_code == 401
    assert c.post(url, {"password":"password123","username":"dave"},content_type = "application/json").status_code == 200
