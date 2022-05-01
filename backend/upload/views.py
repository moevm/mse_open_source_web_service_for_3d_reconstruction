from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework import status
from .serializers import DatasetSerializer, ImageSerializer
from .models import Dataset
from django.utils import timezone, text
from django.conf import settings
from django.http import HttpResponse, FileResponse, JsonResponse
import os
import zipfile
from io import BytesIO
from pathlib import Path


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
                'created_at': timestamp,
                'status': 0
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
                   {}'.format(img_path))

        if meshroom_result_code == 0:
            try:
                user_folder = 'user_{}_{}'.format(request.user.id, text.slugify(timestamp))

                response = {
                    'obj': '/media/datasets/' + user_folder + '/result/texturedMesh.obj',
                    'png': '/media/datasets/' + user_folder + '/result/texture_1001.png'
                }

                # with open(Path.joinpath(img_path, 'result', 'texturedMesh.obj'), "r") as f:
                #     response['obj'] = f.read()
                #
                # with open(Path.joinpath(img_path, 'result', 'texturedMesh.mtl'), "r") as f:
                #     response['mtl'] = f.read()

                return JsonResponse(response, status=status.HTTP_200_OK)

            except FileNotFoundError:
                return Response('Result file was not found', status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            # try:
            #     # TODO: Maybe there are several .png files. You should consider this case.
            #     filenames = ['texturedMesh.obj', 'texture_1001.png']
            #
            #     # Folder name in ZIP archive which contains the above files
            #     # E.g [thearchive.zip]/dirname/abracadabra.txt
            #     zip_subdir = "/"
            #
            #     bytes_stream = BytesIO()
            #     with zipfile.ZipFile(bytes_stream, 'w') as zip_file:
            #         for filename in filenames:
            #             filepath = Path.joinpath(img_path, 'result', filename)
            #             zip_filepath = os.path.join(zip_subdir, filename)
            #             zip_file.write(filepath, zip_filepath)
            #
            #     response = HttpResponse(bytes_stream.getvalue(),
            #                             content_type='application/zip',
            #                             status=status.HTTP_200_OK)
            #
            #     return response
            #
            # except FileNotFoundError:
            #     return Response('Result file was not found', status=status.HTTP_418_IM_A_TEAPOT)
        else:
            return Response('Meshroom internal error', status=status.HTTP_418_IM_A_TEAPOT)


class StatusView(APIView):
    permission_classes = (IsAuthenticated,)
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request, *args, **kwargs):

        dataset_instance = Dataset.objects.filter(user=request.user.id).order_by('-created_at')[0]
        img_path = settings.MEDIA_ROOT / dataset_instance.dataset_path

        folders = ["CameraInit",
                   "FeatureExtraction",
                   "ImageMatching",
                   "FeatureMatching",
                   "StructureFromMotion",
                   "Meshing",
                   "MeshFiltering",
                   "Texturing",
                   "Publish"]

        if 'cache' not in os.listdir(path=img_path):
            response = HttpResponse(0, status=status.HTTP_200_OK)
            return response

        for i in range(1, 10):
            numeric_folder = os.listdir(path=Path.joinpath(img_path, 'cache', folders[i-1]))[0]
            if len(os.listdir(path=Path.joinpath(img_path, 'cache', folders[i-1], numeric_folder))) < 2:
                update = Dataset(id=dataset_instance.id,
                                 user=dataset_instance.user,
                                 dataset_path=dataset_instance.dataset_path,
                                 images_count=dataset_instance.images_count,
                                 created_at=dataset_instance.created_at,
                                 status=i)
                update.save()
                response = HttpResponse(i, status=status.HTTP_200_OK)
                return response

        update = Dataset(id=dataset_instance.id,
                         user=dataset_instance.user,
                         dataset_path=dataset_instance.dataset_path,
                         images_count=dataset_instance.images_count,
                         created_at=dataset_instance.created_at,
                         status=10)
        update.save()
        response = HttpResponse(10, status=status.HTTP_200_OK)

        return response
