from django.contrib.auth.models import AbstractUser
from django.contrib.auth.models import User
from django.db import models


#From BTeamERD.puml

class Ingredient(models.Model):
    ingredientName = models.CharField(max_length=50)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    amount = models.IntegerField()
    describe = models.TextField()
    picture = models.ImageField(null=True, blank=True,upload_to="IngredientImages")
    liquid = models.BooleanField()

    def __str__(self):
        return self.ingredientName + " by " + self.user.username


class Recipe(models.Model):
    recipeName = models.CharField(max_length=50)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    recipe = models.TextField()
    picture = models.ImageField(null=True, blank=True,upload_to="RecipeImages")

    def __str__(self):
        return self.recipeName + " by " + self.user.username


class Required(models.Model):
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE)
    ingredient = models.ForeignKey(Ingredient, on_delete=models.CASCADE)

    def __str__(self):
        return self.ingredient.ingredientName + " in " + self.recipe.recipeName + " by " + self.recipe.user.username


class Shared(models.Model):
    # recipeOwner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='recipeOwner')
    recipeName = models.ForeignKey(Recipe, on_delete=models.CASCADE)
    userShared = models.ForeignKey(User, on_delete=models.CASCADE, related_name="userShared")
    feedback = models.CharField(max_length=200)

    def __str__(self):
        return self.recipeName.recipeName + " made by " + self.recipeName.user.username + " shared with " + self.userShared.username
