import numpy as np
from geodata.utils.tiff_io import ReadGeoTiff
from .pipeline import Pipeline


class Numpy(Pipeline):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.approach = 'numpy'
        self.algorithm = kwargs['algorithm']

    def extract(self):
        # Get dimension and Geo info
        # In development env use low resolution data
        # Todo: use 2m data in production env
        try:
            data, Ysize, Xsize = ReadGeoTiff(self.ref_file)
            self.dimension = [Xsize, Ysize]
        except AttributeError:
            return False

        return data

    def mean(self):
        # Find mean of DEM data

        # Convert raster data to flat array
        np_arr = np.array(self.data)
        flat_arr = np_arr.ravel()

        # Filter the nodata value(-999), then run the mean() function
        mean = flat_arr[flat_arr != self.nodata].mean()
        self.mean = mean.item()
        return self.mean

    def max_value(self):
        # Find maximum in selected DEM

        # Convert raster data to flat array
        np_arr = np.array(self.data)
        flat_arr = np_arr.ravel()

        # Filter the nodata value(-999), then find max value
        maximum = np.max(flat_arr[flat_arr != self.nodata])
        self.maximum = maximum.item()
        return self.maximum

    def min_value(self):
        # Find minimum in selected DEM

        np_arr = np.array(self.data)
        flat_arr = np_arr.ravel()

        minimum = np.min(flat_arr[flat_arr != self.nodata])
        self.minimum = minimum.item()
        return self.minimum

    def analysis(self):
        data = self.extract()

        if data is False:
            return False

        self.data = data

        if self.algorithm == 'mean':
            self.mean()
        elif self.algorithm == 'maximum':
            self.max_value()
        elif self.algorithm == 'minimum':
            self.min_value()
        else:
            raise Exception("Algorithm not exists")

        return True
