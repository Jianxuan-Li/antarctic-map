import json
from django.http import JsonResponse
from rest_framework import views
# from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.status import (HTTP_400_BAD_REQUEST, HTTP_201_CREATED)
from geodata.analysis.dem.analyzer import Analyzer
from rasterio.errors import WindowError


class Analyze(views.APIView):
    permission_classes = (AllowAny,)
    http_method_names = ['post', 'head']

    def post(self, request, algorithm, approach, format=None):
        masking_str = request.data['geom_string']

        try:
            masking_json = json.loads(masking_str)
        except TypeError as err:
            return JsonResponse(
                        {'message': 'JSON format error', 'detail': err},
                        status=HTTP_400_BAD_REQUEST)

        try:
            analyzer = Analyzer()
            analyzer.set_mask(masking_json)
            analyzer.set_algorithm(algorithm)
            results = analyzer.run(approach)
        except (ValueError, WindowError):
            return JsonResponse(
                        {'message': 'No data'},
                        status=HTTP_400_BAD_REQUEST)

        return JsonResponse({
            'dimension': results['dimension'],
            'value': results[algorithm]
        }, safe=False, status=HTTP_201_CREATED)
