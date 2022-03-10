from django.http import HttpResponse
import json


def checkAuthorization(request):
    if request.method == "POST":
        ans = json.loads(request.body)
        if ans['name'] == "admin" and ans['password']=="admin":
            return HttpResponse("True")
        else:
            return HttpResponse("False")
