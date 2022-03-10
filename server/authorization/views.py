from django.shortcuts import render
from .models import User
from .serializers import UserSerializer
from rest_framework import generics

class UserListCreate(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
