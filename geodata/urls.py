from rest_framework.urlpatterns import format_suffix_patterns
from django.urls import path
from .restful import dem, history, sea_ice

urlpatterns = format_suffix_patterns([
    path('dem/<slug:algorithm>/<slug:approach>', dem.Analyze.as_view()),
    path('history/random', history.Random.as_view()),
    path('seaice/dataset', sea_ice.Dataset.as_view())
])
