import os
from django.test import TestCase
from django.db import connection
from geodata.etl_pipeline.sea_ice import etl, util
from geodata.restful.data.history import get_random_point
from geodata.utils.tiff_io import GetDimension
from django.db.utils import ProgrammingError

test_file_date = '20200722'


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

    def test_transform_sea_ice(self):
        etli = etl.ETL()
        png_file = etli.transform(test_file_date)
        self.assertTrue(os.path.exists(png_file))
        self.assertTrue(png_file.endswith(".png"))


class VectorTestCase(TestCase):
    def setUp(self):
        # Load test data to test database
        try:
            file_path = os.path.join(os.path.dirname(__file__),
                                     'test_data',
                                     'historic_sites_test.sql')
            sql_statement = open(file_path).read()
            with connection.cursor() as c:
                c.execute(sql_statement)
        except ProgrammingError:
            pass

    def test_random_historic_point(self):
        point_data = get_random_point()
        self.assertTrue(len(point_data) > 0)
        self.assertTrue(type(point_data[0]) is dict)


class UtilTestCase(TestCase):
    def test_get_dimensions(self):
        # Test to get the dimension of a GeoTiff file
        tif_file = util.get_tiff_file_name(test_file_date)
        x_size, y_size = GetDimension(tif_file)
        self.assertGreaterEqual(x_size, 1)
        self.assertGreaterEqual(y_size, 1)
