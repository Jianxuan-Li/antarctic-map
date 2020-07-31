from django.http import JsonResponse
from rest_framework import views
from rest_framework.permissions import AllowAny
from rest_framework.status import (HTTP_200_OK)
from .data.history import get_random_point


class Random(views.APIView):
    permission_classes = (AllowAny,)
    http_method_names = ['get', 'head']

    def get(self, request, format=None):
        results = get_random_point()
        return JsonResponse({
          'result': results,
          'msg': '√'
        }, safe=False, status=HTTP_200_OK)
