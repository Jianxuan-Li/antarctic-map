from rest_framework import views, serializers
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.status import (HTTP_200_OK)
from geodata.models import Seaice


class SeaiceDateSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    date = serializers.DateField(required=True)
    png_name = serializers.DateField(required=True)


class Dataset(views.APIView):
    permission_classes = (AllowAny,)
    http_method_names = ['get', 'head']

    def get(self, request, format=None):
        results = SeaiceDateSerializer(Seaice.objects.all().order_by('-date'),
                                       many=True)
        return Response(results.data, status=HTTP_200_OK)
