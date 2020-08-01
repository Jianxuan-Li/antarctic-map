from osgeo import gdal
from gdalconst import GA_ReadOnly
from osgeo import osr


def ReadGeoTiff(file_name):
    ds = gdal.Open(file_name)
    band = ds.GetRasterBand(1)
    data_arr = band.ReadAsArray()

    # Use NumPy array.shape to get
    # dimensions(means how many rows) and elements(means how many columns)
    [Ysize, Xsize] = data_arr.shape
    return data_arr, Ysize, Xsize


def GetDimension(file_name):
    # Open the file:
    raster = gdal.Open(file_name)

    # use GDAL to get dimensions of raster file
    return raster.RasterXSize, raster.RasterYSize


def GetGeoInfo(file_name):
    SourceDS = gdal.Open(file_name, GA_ReadOnly)
    GeoT = SourceDS.GetGeoTransform()
    Projection = osr.SpatialReference()
    Projection.ImportFromWkt(SourceDS.GetProjectionRef())
    return GeoT, Projection


def CreateGeoTiff(file_name, data_array, xsize, ysize, geo_t, proj,
                  nodata_value):
    gdal.AllRegister()
    driver = gdal.GetDriverByName('GTiff')
    DataType = gdal.GDT_Float32
    new_file_name = file_name
    # Set up the dataset
    DataSet = driver.Create(new_file_name, xsize, ysize, 1, DataType)
    # the '1' is for band 1.
    DataSet.SetGeoTransform(geo_t)
    DataSet.SetProjection(proj.ExportToWkt())
    # Write the array
    DataSet.GetRasterBand(1).WriteArray(data_array)
    outBand = DataSet.GetRasterBand(1)
    # flush data to disk, set the NoData value and calculate stats
    outBand.FlushCache()
    outBand.SetNoDataValue(nodata_value)
    return new_file_name
