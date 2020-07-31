# Sea ice data download url
# https://www.polarview.aq/images/27_AMSR2/20200705/20200705.antarctic.tar.gz
import os
from django.conf import settings
import shutil
import urllib
import tarfile
from .util import get_yesterday_str, get_default_file_name
import mapnik


class ETL():
    def __init__(self):
        self.save_path = None
        self.tiff_name = None
        self.source_url_template = "https://www.polarview.aq/images/27_AMSR2/{}/{}.antarctic.tar.gz"

    def download(self, date_str=None):
        if date_str is None:
            date_str = get_yesterday_str()

        self.save_path = get_default_file_name(date_str)

        url = self.source_url_template.format(date_str, date_str)
        urllib.request.urlretrieve(url, self.save_path)
        return self.save_path

    def extract(self, file_name=None):
        # Unpacks downloaded data file and only keep the GeoTiff file
        tar_file = get_default_file_name(file_name)

        tar = tarfile.open(tar_file, "r:gz")
        member = "data/polarview/27_AMSR2/{}/{}.antarctic.tif" \
                 .format(file_name, file_name)

        tar.extract(member, path=os.path.join(settings.GIS_DATA_DIR,
                                              settings.SEA_ICE_DATA_DIR_NAME))
        tar.close()

        self.tiff_name = os.path.join(settings.GIS_DATA_DIR,
                                      settings.SEA_ICE_DATA_DIR_NAME,
                                      "{}.tif".format(file_name))

        shutil.move(os.path.join(settings.GIS_DATA_DIR,
                                 settings.SEA_ICE_DATA_DIR_NAME,
                                 member),
                    self.tiff_name)

        # Clear tar file and unpacked dir
        os.remove(tar_file)
        shutil.rmtree(os.path.join(settings.GIS_DATA_DIR,
                                   settings.SEA_ICE_DATA_DIR_NAME,
                                   'data'))

        return self.tiff_name

    def transform(self, file_name=None):

        pass
