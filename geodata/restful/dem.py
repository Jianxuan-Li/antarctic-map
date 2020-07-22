import json
from django.http import JsonResponse
from rest_framework import views
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.status import (HTTP_400_BAD_REQUEST, HTTP_201_CREATED)

class Mean(views.APIView):
    permission_classes = (AllowAny,)
    http_method_names = ['post', 'head']

    def post(self, request, approach, format=None):
        geom_data = request.data['geom_string']

        try:
            json_geom_data = json.loads(geom_data)
        except TypeError as err:
            return JsonResponse({'message': 'JSON format error'}, status=HTTP_400_BAD_REQUEST)

        # TODO: approachs

        return JsonResponse(json_geom_data, safe=False, status=HTTP_201_CREATED)