from pickle import FALSE
# Author Hamish Phillips
# Date: 20/08/2024
# Description: This file is used to create factories for the tests to use

import factory
from django.contrib.auth.models import User
from main.models import Ingredient
from main.models import Recipe
from main.models import Required

# Not sure if we have a User setup or whether this is done separately in django
class UserFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = User
    password = "postgres"
    username = "postgres"
    is_superuser = True
    is_staff = True

class IngredientFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Ingredient
    ingredientName = "Cheese"
    user = factory.SubFactory(UserFactory)
    amount = 2
    describe = "I have two slices of cheese"
    liquid = False

class RecipeFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Recipe
    recipeName = 'Cheese Scones'
    user = factory.SubFactory(UserFactory)
    recipe = 'Two Cups of Flour, One Cup of Cheese, 3 x Eggs'
    picture = False

class RequiredFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Required
    recipe = factory.SubFactory(RecipeFactory)
    ingredient = factory.SubFactory(IngredientFactory)
    amount = 2

