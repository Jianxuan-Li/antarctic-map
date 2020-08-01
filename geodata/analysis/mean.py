
from geodata.analysis.dem_pipeline import Pipeline


def mean_numpy(masking_json):
    # Create a analytics pipeline
    pipeline = Pipeline()

    (True
        | pipeline.validation(masking_json)
        | pipeline.masking('tiff')
        | pipeline.analysis('numpy')
        | pipeline.load())

    return pipeline.result
