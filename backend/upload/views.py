from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework import status
from .serializers import DatasetSerializer, ImageSerializer
from .models import Dataset
from django.utils import timezone, text


class UploadView(APIView):
    permission_classes = (IsAuthenticated,)
    parser_classes = (MultiPartParser, FormParser)

    def get(self, request, *args, **kwargs):
        datasets = Dataset.objects.all()
        serializer = DatasetSerializer(datasets, many=True)
        return Response(serializer.data)

    def post(self, request, *args, **kwargs):
        # Convert QueryDict to Python's dict
        images = dict(request.data.lists())['images']

        timestamp = timezone.now()
        dataset_serializer = DatasetSerializer(
            data={
                'user': request.user.id,
                'dataset_path': 'datasets/user_{}_{}'.format(request.user.id, text.slugify(timestamp)),
                'images_count': len(images),
                'created_at': timestamp
            }
        )
        dataset_serializer.is_valid(raise_exception=True)
        dataset_instance = dataset_serializer.save()

        for image in images:
            wrapped_image = {
                'dataset': dataset_instance.id,
                'image': image
            }
            image_serializer = ImageSerializer(data=wrapped_image)
            image_serializer.is_valid(raise_exception=True)
            image_serializer.save()

        return Response(dataset_serializer.data, status=status.HTTP_201_CREATED)
