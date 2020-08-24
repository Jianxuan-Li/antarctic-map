from osgeo import gdal
from geodata.utils.tiff_io import ReadGeoTiff
from .pipeline import Pipeline


class GDAL(Pipeline):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.approach = 'gdal'

    def analysis(self):
        # Get dimension and Geo info
        # In development env use low resolution data
        ref_file = self.ref_file

        gtif = gdal.Open(ref_file)
        srcband = gtif.GetRasterBand(1)

        # Must set nodata value before run GetStatistics()
        # Can't set multiple value here, so set nodata value as -999
        #   when masking the DEM data
        srcband.SetNoDataValue(self.nodata)

        # Get raster statistics
        stats = srcband.GetStatistics(True, True)

        self.mean = stats[2]
        self.maximum = stats[1]
        self.minimum = stats[0]

        data, Ysize, Xsize = ReadGeoTiff(self.ref_file)
        self.dimension = [Xsize, Ysize]
        return True
