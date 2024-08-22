# Creating tests for database models.

import pytest

pytestPantryPal = pytest.mark.django_db

@pytestPantryPal
class TestIngredientModel:
    def test_str_return(self, ingredient_factory):
        ingredient = ingredient_factory(ingredientName ="Cheese")
        expected_string = "Cheese by postgres"
        assert ingredient.__str__() == expected_string

# tests are for changes in our application i.e max length on strings.