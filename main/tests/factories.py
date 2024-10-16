# Author Hamish Phillips
# Date: 20/08/2024
# Description: This file is used to create factories for the tests to use

import factory
from django.contrib.auth.hashers import make_password
from django.contrib.auth.models import User
from main.models import *


# Not sure if we have a User setup or whether this is done separately in django
class UserFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = User
        django_get_or_create = ('username', 'password',)

    password = make_password("password")
    username = "postgres"
    # I think we should test normal clients without access
    # is_superuser = True
    # is_staff = True


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

class SharedFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Shared
    recipeOwner = factory.SubFactory(UserFactory)
    recipeName = factory.SubFactory(RecipeFactory)
    userShared = factory.SubFactory(UserFactory)
    feedback = "This is a great recipe"

class ProfileFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Profile
    user = factory.SubFactory(UserFactory)
    picture = False