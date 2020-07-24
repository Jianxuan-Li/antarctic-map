
from geodata.etl_pipeline.pipeline import Pipeline


def mean_numpy(masking_json):
    # Create a ETL pipeline
    pipeline = Pipeline()

    (True
        | pipeline.validation(masking_json)
        | pipeline.masking('tiff')
        | pipeline.analysis('numpy')
        | pipeline.load())

    return pipeline.result
