import os
import json
import rasterio
from rasterio.mask import mask
from django.conf import settings


class Pipeline():
    def __init__(self, options=None):
        self.options = options
        self.current_stage = None
        self.nodata = -999

    def __bool__(self):
        return True

    def call(self, masking_json):
        (True
            | self.validation(masking_json)
            | self.masking('tiff')
            | self.analysis()
            | self.load())

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

        ref_file = os.path.join(settings.GIS_DATA_DIR, 'DEM',
                                'krigged_dem_nsidc.tiff')

        # Mask the DEM data, and use -999 fills nodata.
        with rasterio.open(ref_file) as src:
            out_image, out_transform = mask(src, [geom],
                                            crop=True, nodata=self.nodata)
        out_meta = src.meta.copy()

        # save the resulting raster
        out_meta.update({"driver": "GTiff",
                         "height": out_image.shape[1],
                         "width": out_image.shape[2],
                         "transform": out_transform})

        dest_file = os.path.join(settings.GIS_DATA_DIR, 'DEM', 'masked.tif')
        with rasterio.open(dest_file, "w", **out_meta) as dest:
            dest.write(out_image)

        self.ref_file = dest_file

        return True

    def load(self):
        self.result = {
            "dimension": self.dimension,
            "mean": self.mean
        }
        return True
