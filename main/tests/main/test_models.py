# Creating tests for database models.
# Author: Hamish Phillips
# Date: 20/08/2024
#''' Description: Test the models in the main application
# If you want to create more tests, you can fine more strings to return
# i.e test_str_return 1 and test_str_return 2
# '''

import pytest

pytestPantryPal = pytest.mark.django_db

@pytestPantryPal
class TestIngredientModel:
    def test_str_return(self, ingredient_factory):
        ingredient = ingredient_factory(ingredientName ="Cheese")
        expected_string = "Cheese by postgres"
        assert ingredient.__str__() == expected_string


@pytestPantryPal
class TestRecipeModel:
    def test_str_return(self, recipe_factory):
        recipe = recipe_factory(recipeName="Cheese Scones")
        expected_string = "Cheese Scones by postgres"
        assert recipe.__str__() == expected_string

@pytestPantryPal
class TestRequiredModel:
    def test_str_return(self, required_factory):
        required = required_factory()
        expected_string = "Cheese in Cheese Scones by postgres"
        assert required.__str__() == expected_string

@pytestPantryPal
class TestSharedModel:
    def test_str_return(self, shared_factory):
        shared = shared_factory()
        expected_string = "Cheese Scones made by postgres shared with postgres"
        assert shared.__str__() == expected_string

@pytestPantryPal
class TestProfileModel:
    def test_str_return(self, profile_factory):
        shared = profile_factory()
        expected_string = "Profile of postgres"
        assert shared.__str__() == expected_string
