from django.urls import path

from . import views

urlpatterns = [
    path("", views.index_page, name="index"),
    path("api/login/", views.login, name = "api_login"),
    path("login", views.login_page, name = "login"),
    path("createaccount",views.create_account_page, name="createaccount")
]