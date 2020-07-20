from map.settings import *

ALLOWED_HOSTS = ['*']

DEBUG = True

LOCAL_STATIC = True

LOGGING = {}

WEBPACK_LOADER = {
    'DEFAULT': {
        'BUNDLE_DIR_NAME': 'dist/',
        'STATS_FILE': os.path.join(BASE_DIR, 'webpack-stats-development.json')
    },
    'VENDOR': {
        'BUNDLE_DIR_NAME': 'dist/',
        'STATS_FILE': os.path.join(BASE_DIR, 'webpack-stats-vendor.json')
    },
}

DATABASES = {
    'default': {
        'ENGINE': 'django.contrib.gis.db.backends.postgis',
        'NAME': 'antarctic',
        'USER': 'antarctic',
        'PASSWORD': 'antarctic',
        'HOST': '172.30.5.22',
        'PORT': 5432
    },
}