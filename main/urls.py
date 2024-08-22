from django.urls import path

from . import views

urlpatterns = [
    path("", views.index_page, name="index"),
    path("api/login/", views.api_login, name = "api_login"),
    path("api/session/", views.session_view, name = "api_session"),
    path("api/whoami/", views.whoami_view, name = "api_whoami"),
    path("login", views.login_page, name = "login"),
    path("logout", views.logout_user, name = "logout"),
    path("createaccount",views.create_account_page, name="createaccount")
]