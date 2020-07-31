import os
from django.test import TestCase
from django.db import connection
from geodata.etl_pipeline.sea_ice import etl
from geodata.restful.data.history import get_random_point

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


class VectorTestCase(TestCase):
    def setUp(self):
        file_path = os.path.join(os.path.dirname(__file__),
                                 'test_data',
                                 'historic_sites_test.sql')
        sql_statement = open(file_path).read()
        with connection.cursor() as c:
            c.execute(sql_statement)

    def test_random_historic_point(self):
        point_data = get_random_point()
        self.assertTrue(len(point_data) > 0)
        self.assertTrue(type(point_data[0]) is dict)
