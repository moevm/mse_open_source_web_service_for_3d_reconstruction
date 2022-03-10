from django.db import models

class User(models.Model):
    login = models.CharField(max_length=30)
    password = models.CharField(max_length=30)
    jwt_token = models.CharField(max_length=50)
