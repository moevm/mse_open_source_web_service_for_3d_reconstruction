from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework import status
from .serializers import DatasetSerializer, ImageSerializer
from .models import Dataset
from django.utils import timezone, text
from django.conf import settings
from django.http import FileResponse
import os


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

        # Launch Meshroom
        img_path = settings.MEDIA_ROOT / dataset_instance.dataset_path
        meshroom_result_code = os.system('python3 launch.py \
                   ./Meshroom \
                   ./pipeline_graph_template.mg \
                   {} --forceStatus'.format(img_path))

        if meshroom_result_code == 0:
            try:
                result_obj_path = img_path / 'result/texturedMesh.obj'
                return FileResponse(open(result_obj_path, 'rb'))
            except FileNotFoundError:
                return Response('Result file was not found', status=status.HTTP_200_OK)
        else:
            return Response('Meshroom internal error', status=status.HTTP_200_OK)
