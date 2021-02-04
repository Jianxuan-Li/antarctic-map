# Design

## Restful APIs

**Raster**:

* `dem/mean/<approach>`: average elevation value of DEM
* `seaice/mean/<approach>`: average sea ice coverage value from a `27_AMSR2` datasource
* `seaice/mean/<approach>/<start>/<end>`: average sea ice coverage value of a period from a set of `27_AMSR2` data
* `seaice/trend/<approach>/<start>/<end>`: trend of sea ice coverage in specific days

**Vetor**:

* `history/random`: return a random feature of historic sites layer
* `human-point/nearest`: return a human activity point which is the nearest point of a selected point
* `human-point/navigation`: return a line to a point, slope less than a specific value, no lakes, no streams

## ETL Pipelines

### Sea ice ETL

1. download: from the polarview antarctic map (https://www.polarview.aq/antarctic)
2. extract: unpacks the downloaded file and extract the `GeoTiff` file to sea ice data dir
3. transform: resample and transform to a png image(rendered by `Mapnik`)
4. load: save extent and file path to `PostGIS`

## Analysis

### DEM

Objective: mean, maximum, minimum

1. masks the `DEM` data to specifically extent 
2. analyze by `numpy`, `GDAL`

### Sea ice

Objective: trend

1. masks the sea ice data to specifically extent. If user determine a date range(continuous days), only use the data which in these days
2. analyze by `numpy` or `Apache Spark`