from django.shortcuts import render
from django.http import HttpResponse, JsonResponse

import json
from django.contrib.auth import authenticate, login
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.http import require_POST


def index_page(request):
    return render(request, "dist/index.html")


def login_page(request):
    return render(request, "dist/login.html")


def create_account_page(request):
    return render(request, "dist/createaccount.html")


@require_POST
def api_login(request):
    body = json.loads(request.body)
    username = body.get("username")
    password = body.get("password")

    if username is None or password is None:
        return HttpResponse("invalid request").status_code(400)

    user = authenticate(username=username, password=password)

    if user is None:
        return HttpResponse("invalid login").status_code(401)

    login(request, user)
    return HttpResponse("login worked")


@ensure_csrf_cookie
def session_view(request):
    if not request.user.is_authenticated:
        return JsonResponse({"isauthenticated": False})
    return JsonResponse({"isauthenticated": True})


def whoami_view(request):
    if not request.user.is_authenticated:
        return JsonResponse({"isauthenticated": False})
    return JsonResponse({"username": request.user.username})
