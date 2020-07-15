from django.conf import settings

def local_static(request):
    return {'local_static': settings.LOCAL_STATIC, 'debug': settings.DEBUG}

