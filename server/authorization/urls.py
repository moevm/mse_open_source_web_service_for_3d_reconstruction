from django.urls import path
from . import views
from . import auth_api

urlpatterns = [
    #path('check/',views.UserListCreate.as_view())
    path('check/',auth_api.checkAuthorization)
]