import os
import json
import rasterio
import numpy as np
from rasterio.mask import mask
from django.conf import settings
from geodata.utils.tiff_io import ReadGeoTiff


class Pipeline():
    def __init__(self, options=None):
        self.options = options
        self.current_stage = None

    def __bool__(self):
        return True

    def validation(self, geojson_obj):
        self.current_stage = 'validation'
        sorted_str = json.loads(geojson_obj)
        # TODO: validate geojson
        self.geojson_obj = sorted_str
        return True

    def masking(self, geo_tiff):
        self.current_stage = 'masking'
        self.geo_tiff = geo_tiff

        geom = self.geojson_obj['features'][0]['geometry']

        ref_file = os.path.join(settings.GIS_DATA_DIR, 'DEM', 'krigged_dem_nsidc.tiff')

        with rasterio.open(ref_file) as src:
            out_image, out_transform = mask(src, [geom], crop=True)
        out_meta = src.meta.copy()

        # save the resulting raster
        out_meta.update({"driver": "GTiff",
                         "height": out_image.shape[1],
                         "width": out_image.shape[2],
                         "transform": out_transform})

        dest_file = os.path.join(settings.GIS_DATA_DIR, 'DEM', 'masked.tif')
        with rasterio.open(dest_file, "w", **out_meta) as dest:
            dest.write(out_image)

        return True

    def analysis(self, approach):
        self.approach = approach

        # Get dimension and Geo info
        # In development env use low resolution data
        ref_file = os.path.join(settings.GIS_DATA_DIR, 'DEM', 'masked.tif')

        try:
            data, Ysize, Xsize = ReadGeoTiff(ref_file)
            self.dimension = [Xsize, Ysize]
        except AttributeError as err:
            print(err)
            return False

        np_arr = np.array(data)
        flat_arr = np_arr.ravel()
        mean = flat_arr[(flat_arr != 0) & (flat_arr != -999)].mean()
        self.mean = mean
        return True

    def load(self):
        self.result = {
            "dimension": self.dimension,
            "mean": self.mean.item()
        }
        return True
