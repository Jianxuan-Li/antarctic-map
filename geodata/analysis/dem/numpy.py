import numpy as np
from geodata.utils.tiff_io import ReadGeoTiff
from .pipeline import Pipeline


class Numpy(Pipeline):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.approach = 'numpy'

    def analysis(self):
        # Get dimension and Geo info
        # In development env use low resolution data
        # Todo: use 2m data in production env
        try:
            data, Ysize, Xsize = ReadGeoTiff(self.ref_file)
            self.dimension = [Xsize, Ysize]
        except AttributeError as err:
            print(err)
            return False

        np_arr = np.array(data)
        flat_arr = np_arr.ravel()

        # Filter the nodata value(-999), then run the mean() function
        mean = flat_arr[flat_arr != self.nodata].mean()
        self.mean = mean.item()
        return True
