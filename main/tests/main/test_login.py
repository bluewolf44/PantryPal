from django.test import TestCase
import pytest
# Create your tests here.


pytestPantryPal = pytest.mark.django_db

@pytestPantryPal
class TestLogin:
    def test_str_return(self, user_factory):
        user = user_factory(username="postgres")
        expected_string = "postgres"
        assert user.__str__() == expected_string and user.__str__() != "postgres1"
        
