import pytest
import json

from django.contrib.auth.hashers import make_password
from django.urls import reverse
from django.test import Client

from main.models import *

pytestPantryPal = pytest.mark.django_db

@pytestPantryPal
def test_feedback_shared_recipe_view(user_factory, shared_factory):
    c = Client()
    url = reverse("feedback_shared_recipe", args=[9999])
    assert c.post(url).status_code == 401  # Not logged in

    user = user_factory(username="dave", password=make_password("password123"))
    c.force_login(user)
    assert c.post(url, {}, content_type="application/json").status_code == 400  # No body

    shared = shared_factory(userShared=user)

    url = reverse("feedback_shared_recipe", args=[shared.id])
    response = c.post(url, {"feedback": "10/10 would eat again"}, content_type="application/json")
    assert response.status_code == 200
    assert Shared.objects.get(id=shared.id).feedback == "10/10 would eat again"

