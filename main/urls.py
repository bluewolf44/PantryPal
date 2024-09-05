from django.urls import path

from . import views

urlpatterns = [
    path("", views.index_page, name="index"),
    path("addIngredient", views.index_page, name="add_ingredient"),
    path("createAccount", views.index_page, name="create_account"),
    path("api/login/", views.api_login, name="api_login"),
    path("api/session/", views.session_view, name="api_session"),
    path("api/whoami/", views.whoami_view, name="api_whoami"),
    path("api/logout/", views.logout_view, name="api_logout"),
    path("api/deleteAccount/", views.delete_account_view, name="api_delete_account"),
    path("api/createIngredient/", views.create_ingredient, name="api_create_ingredient"),
    path("api/createAccount/", views.create_account, name="create_account"),
    path("api/getIngredients/", views.get_user_ingredients, name="api_get_ingredients"),
    path("api/deleteIngredient/<int:ingredientId>", views.delete_ingredient_view, name="api_delete_ingredients")
]
