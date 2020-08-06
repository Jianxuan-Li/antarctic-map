from rest_framework.urlpatterns import format_suffix_patterns
from django.urls import path
from .restful import dem, history, sea_ice

urlpatterns = format_suffix_patterns([
    path('dem/mean/<slug:approach>', dem.Mean.as_view()),
    path('history/random', history.Random.as_view()),
    path('seaice/dataset', sea_ice.Dataset.as_view())
])
