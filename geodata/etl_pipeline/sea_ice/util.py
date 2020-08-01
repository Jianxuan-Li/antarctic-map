import os
from django.conf import settings
from datetime import date, timedelta


def get_yesterday_str():
    yesterday = date.today() - timedelta(days=1)
    return yesterday.strftime('%Y%m%d')


def get_default_file_name(file_name=None):
    if file_name is None or str(file_name) is None:
        file_name = get_yesterday_str()

    return os.path.join(settings.GIS_DATA_DIR,
                        settings.SEA_ICE_DATA_DIR_NAME,
                        '{}.tar.gz'.format(file_name))


def get_tiff_file_name(date_str=None):
    if date_str is None or str(date_str) is None:
        date_str = get_yesterday_str()

    return os.path.join(settings.GIS_DATA_DIR,
                        settings.SEA_ICE_DATA_DIR_NAME,
                        "{}.tif".format(date_str))


def get_png_file_name(date_str=None):
    if date_str is None or str(date_str) is None:
        date_str = get_yesterday_str()

    return os.path.join(settings.GIS_DATA_DIR,
                        settings.SEA_ICE_DATA_DIR_NAME,
                        # TODO: change storage
                        "{}.png".format(date_str))
