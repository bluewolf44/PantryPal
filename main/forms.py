from django import forms


class IngredientsForm(forms.Form):
    ingredientName = forms.CharField(label="ingredientName", max_length=100)
    picture = forms.ImageField(label="picture",required=False)
    describe = forms.CharField(label="describe",required=False)
    amount = forms.IntegerField(label="amount")
    liquid = forms.BooleanField(label="liquid",required=False)
