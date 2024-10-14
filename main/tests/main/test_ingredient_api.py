import json
from django.contrib.auth.hashers import make_password
import pytest
from django.core.serializers import serialize

from django.urls import reverse
from django.test import Client

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

    response_data = json.loads(response.json())

    for item in response_data:
        fields = item.get("fields", {})
        assert fields == {"ingredientName": "cheese", "user": user.id, "amount": 2, "describe": "I have two slices of cheese", "picture": "", "liquid": False} or \
               fields == {"ingredientName": "milk", "user": user.id, "amount": 2, "describe": "I have two slices of cheese", "picture": "", "liquid": False}

    assert len(response_data) == 2
    assert response_data[0] != response_data[1]

@pytestPantryPal
def test_create_ingredient_api(user_factory):
    c = Client()
    url = reverse("api_create_ingredient")
    assert c.post(url).status_code == 401
    user = user_factory(username="dave", password=make_password("password123"))
    c.force_login(user)
    assert c.post(url, {}, content_type="application/json").status_code == 400
    assert c.post(url, {
        "ingredientName": "cheese",
        "amount": 500,
        "describe": "yellow",
        "liquid": False
    }, files={"picture":"cheese.jpg"}).status_code == 201
    assert len(Ingredient.objects.filter(ingredientName="cheese", amount=500, describe="yellow", liquid=False)) == 1  #add picture when addded


@pytestPantryPal
def test_get_ingredients_by_required(user_factory,recipe_factory,required_factory,ingredient_factory):
    c = Client()
    user = user_factory(username="dave", password=make_password("password123"))
    recipe = recipe_factory(user = user)

    url = reverse("api_get_ingredients_by_required",args=[recipe.pk])
    assert c.post(url).status_code == 401 # Not logged in

    # Test empty
    c.force_login(user)
    response = c.get(url)
    assert response.status_code == 200
    assert len(json.loads(response.json())) == 0

    i1 = ingredient_factory(user=user, ingredientName="cheese")
    i2 = ingredient_factory(user=user, ingredientName="milk")
    i3 = ingredient_factory(user=user, ingredientName="flour")
    required_factory(recipe=recipe, ingredient=i1)
    required_factory(recipe=recipe, ingredient=i2)
    required_factory(recipe=recipe, ingredient=i3)

    # Other data so we can check if there some funny stuff happing
    other = user_factory(username="jeff", password=make_password("password123"))
    i4 = ingredient_factory(user=other, ingredientName="milk")
    recipe2 = recipe_factory(user=other)
    required_factory(recipe=recipe2, ingredient=i4)

    response = c.get(url)
    assert response.status_code == 200
    assert serialize("json", [i1, i2, i3]) == response.json()

@pytestPantryPal
def test_update_ingredient_by_amount(user_factory, ingredient_factory):
    c = Client()
    user = user_factory(username="dave", password=make_password("password123"))
    # recipe = recipe_factory(user = user)

    url = reverse("api_update_ingredient_by_amount")
    assert c.post(url).status_code == 401 # Not logged in

    c.force_login(user)
    i1 = ingredient_factory(user=user, ingredientName="cheese")
    i2 = ingredient_factory(user=user, ingredientName="milk")
    i3 = ingredient_factory(user=user, ingredientName="flour")

    # Creating data that will be sent
    data = []
    for i in [i1, i2, i3]:
        data.append({
            "pk": i.pk,
            "amount": i.amount+200
        })

    response = c.post(url,data,content_type='application/json')
    assert response.status_code == 201
    for i in [i1, i2, i3]:
        assert Ingredient.objects.filter(pk=i.pk)[0].amount == i.amount+200

