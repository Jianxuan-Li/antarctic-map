from .etl import SeaIceETL
from geodata.etl_pipeline.pipeline import Pipeline


class SeaIcePipeline(Pipeline):
    def __init__(self, date_str=None):
        super().__init__()

        self.date_str = date_str
        self.elti = SeaIceETL(in_pipe=True)
        pass

    def run(self):
        (True
            | self.elti.download(self.date_str)
            | self.elti.extract(self.date_str)
            | self.elti.transform(self.date_str)
            | self.elti.load(self.date_str))

        self.data = self.elti.data
