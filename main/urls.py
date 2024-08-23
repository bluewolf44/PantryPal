from django.urls import path

from . import views

urlpatterns = [
    path("", views.index_page, name="index"),
    path("api/login/", views.api_login, name = "api_login"),
    path("api/session/", views.session_view, name = "api_session"),
    path("api/whoami/", views.whoami_view, name = "api_whoami"),
    path("logout", views.logout_user, name = "logout"),
    path("api/createIngredient",views.create_ingredient, name = "create_ingredient"),
    path("api/createAccount",views.create_account, name = "create_account")
]