import os
from django.test import TestCase

from geodata.etl_pipeline.sea_ice import etl
test_file_date = '20200726'


class ETLTestCase(TestCase):
    def test_download_sea_ice(self):
        etli = etl.ETL()
        downloaded_file_path = etli.download(test_file_date)
        self.assertTrue(os.path.exists(downloaded_file_path))

    def test_extract_sea_ice_tiff(self):
        etli = etl.ETL()
        tiff_file = etli.extract(test_file_date)
        self.assertTrue(os.path.exists(tiff_file))
        self.assertTrue(tiff_file.endswith(".tif"))
