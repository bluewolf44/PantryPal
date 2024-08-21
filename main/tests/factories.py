from pickle import FALSE

import factory
from django.contrib.auth.models import User
from main.models import Ingredient

# Not sure if we have a User setup or whether this is done separately in django
class UserFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = User
    password = "test"
    username = "test"
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

