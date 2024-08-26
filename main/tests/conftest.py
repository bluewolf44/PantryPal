# Author: Hamish Phillips
# Date: 20/08/2024
# Description: Used to import the factories into the tests

from pytest_factoryboy import register

from .factories import IngredientFactory
from .factories import RecipeFactory
from .factories import UserFactory

register(IngredientFactory)
register(RecipeFactory)
register(UserFactory)
