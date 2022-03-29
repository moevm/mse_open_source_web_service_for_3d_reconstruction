from rest_framework import serializers
from .models import Dataset, Image


class DatasetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Dataset
        fields = ('user', 'dataset_path', 'images_count')


class ImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Image
        fields = '__all__'

