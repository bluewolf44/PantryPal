from django.db import models

#From BTeamERD.puml

class User(models.Model):
	userId = models.CharField(max_length=10)
	username = models.CharField(max_length=30)
	password = models.CharField(max_length=30)
	firstname = models.CharField(max_length=50)
	lastname = models.CharField(max_length=50)
	email = models.CharField(max_length=100)

class Ingredient(models.Model):
	ingredientName = models.CharField(max_length=50)
	user = models.ForeignKey(User, on_delete=models.CASCADE)
	amount = models.IntegerField()
	describe = models.TextField()

class Recipe(models.Model):
	recipeName = models.CharField(max_length=50)
	user = models.ForeignKey(User, on_delete=models.CASCADE)
	recipe = models.TextField()

class Required(models.Model):
	recipe = models.ForeignKey(Recipe, on_delete = models.CASCADE)
	ingredient = models.ForeignKey(Ingredient, on_delete = models.CASCADE)
	amount = models.IntegerField()