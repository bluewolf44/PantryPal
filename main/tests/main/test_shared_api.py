import pytest
import json

from django.contrib.auth.hashers import make_password
from django.urls import reverse
from django.test import Client
from django.core.serializers import serialize

from main.models import *

pytestPantryPal = pytest.mark.django_db


@pytestPantryPal
def test_share_recipe_view(user_factory, recipe_factory):
    c = Client()
    url = reverse("api_share_recipe")
    assert c.post(url).status_code == 401  # Not logged in

    user = user_factory(username="dave", password=make_password("password123"))
    c.force_login(user)

    assert c.post(url, {}).status_code == 400  # invalid body

    user1 = user_factory(username="jeff", password=make_password("password123"))
    user2 = user_factory(username="bob", password=make_password("password123"))
    user3 = user_factory(username="james", password=make_password("password123"))
    r1 = recipe_factory(user=user, recipeName="Cheese")
    recipe_factory(user=user, recipeName="Flour")

    response = c.post(url, {
        "user_ids": str([user1.id, user2.id]),
        "recipe_id": r1.id,
    }, files={})

    assert response.status_code == 201
    assert len(Shared.objects.filter(recipeName=r1.id, userShared=user1, recipeOwner=user)) == 1
    assert len(Shared.objects.filter(recipeName=r1.id, userShared=user2, recipeOwner=user)) == 1
    assert len(Shared.objects.filter(recipeName=r1.id)) == 2
