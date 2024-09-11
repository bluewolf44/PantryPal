from django import forms


class IngredientsForm(forms.Form):
    ingredientName = forms.CharField(label="ingredientName", max_length=100)
    picture = forms.ImageField(label="picture")
    describe = forms.CharField(label="describe", max_length=100)
    amount = forms.IntegerField(label="amount")
    liquid = forms.BooleanField(label="liquid",required=False)

class RecipeForm(forms.Form):
    recipeName = forms.CharField(label="recipeName", max_length=50)
    # user - i guess this is not needed here
    recipe = forms.TextField(label="recipe")
    picture = forms.ImageField(label="picture")


