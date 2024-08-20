# Creating tests for database models.

import pytest

pytestPantryPal = pytest.mark.django_db


class TestIngredientModel:
    def test_str_return(self, ingredient_factory):
        ingredient = ingredient_factory(ingredientName ="Cheese", username = "test")
        expected_string = "Cheese by test"
        assert ingredient.__str__() == expected_string

# tests are for changes in our application i.e max length on strings.