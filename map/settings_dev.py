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