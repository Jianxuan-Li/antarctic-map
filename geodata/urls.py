from django.conf.urls import url
from rest_framework import routers
from rest_framework.urlpatterns import format_suffix_patterns
from django.urls import include, path
from .restful import dem

router = routers.DefaultRouter()

# urlpatterns = [
#     url(r'', include(router.urls)),
# ]

urlpatterns = format_suffix_patterns([
    path('dem/mean/<slug:approach>', dem.Mean.as_view()),
])

# urlpatterns += router.urls
