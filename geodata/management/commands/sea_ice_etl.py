from django.core.management.base import BaseCommand
from geodata.etl_pipeline.sea_ice.pipeline import SeaIcePipeline


class Command(BaseCommand):
    help = 'Import sea ice data by date(YYYYMMDD)'

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

    def add_arguments(self, parser):
        parser.add_argument('date', nargs='?', type=str)
        pass

    def handle(self, *args, **options):
        pipe = SeaIcePipeline(options['date'])
        pipe.run()
        data = pipe.dump()
        print(data)
        pass
