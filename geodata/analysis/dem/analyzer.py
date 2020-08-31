from geodata.analysis.dem.numpy import Numpy
from geodata.analysis.dem.gdal import GDAL


class Analyzer():
    def __init__(self):
        self.approach_algo = {
            "numpy": Numpy,
            "gdal": GDAL
        }

    def set_mask(self, masking_json):
        self.masking_json = masking_json

    def set_algorithm(self, algo):
        self.algorithm = algo

    def analyze(self, approach_class):
        instance = approach_class(algorithm=self.algorithm)
        instance.call(self.masking_json)
        return instance

    def run(self, approach):
        try:
            pipeline = self.analyze(self.approach_algo[approach])
        except KeyError:
            raise Exception("Algorithm of {} is not exists".format(approach))
        return pipeline.result
