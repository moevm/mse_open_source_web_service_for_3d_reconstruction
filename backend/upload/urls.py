from django.urls import path
from . import views

app_name = 'authentication'
urlpatterns = [
    path('', views.UploadView.as_view(), name='upload_dataset'),
    path('status/', views.StatusView.as_view()),
    path('download/', views.DownloadView.as_view()),
]
