from django.shortcuts import render
from django.http import HttpResponse

import json
from django.contrib.auth import authenticate, login
from django.views.decorators.http import require_POST


def index(request):
    return render(request, "dist/index.html")


@require_POST
def login(request):
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
