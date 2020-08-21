import json
from django.http import JsonResponse
from rest_framework import views
# from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.status import (HTTP_400_BAD_REQUEST, HTTP_201_CREATED)
from geodata.analysis.mean import mean_numpy
from rasterio.errors import WindowError


class Mean(views.APIView):
    permission_classes = (AllowAny,)
    http_method_names = ['post', 'head']

    def post(self, request, approach, format=None):
        masking_str = request.data['geom_string']

        try:
            masking_json = json.loads(masking_str)
        except TypeError as err:
            return JsonResponse(
                        {'message': 'JSON format error', 'detail': err},
                        status=HTTP_400_BAD_REQUEST)

        try:
            results = mean_numpy(masking_json)
        except (ValueError, WindowError):
            return JsonResponse(
                        {'message': 'No data'},
                        status=HTTP_400_BAD_REQUEST)

        return JsonResponse({
            'dimension': results['dimension'],
            'mean': round(results['mean'], 2)
        }, safe=False, status=HTTP_201_CREATED)
