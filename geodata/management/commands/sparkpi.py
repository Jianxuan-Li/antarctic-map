from operator import add
from random import random
from django.core.management.base import BaseCommand
from geodata.utils.spark import get_spark


class Command(BaseCommand):
    help = 'Spark Pi'

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

    def add_arguments(self, parser):
        parser.add_argument('partitions', nargs='?', type=int, default=10)

    def handle(self, *args, **options):
        # Test connect to spark master
        spark = get_spark('test_get')
        n = 100000 * options['partitions']

        print('partitions: ', options['partitions'])

        def f(_):
            x = random() * 2 - 1
            y = random() * 2 - 1
            return 1 if x ** 2 + y ** 2 <= 1 else 0

        count = spark.sparkContext\
            .parallelize(range(1, n + 1), options['partitions'])\
            .map(f)\
            .reduce(add)
        result = 4.0 * count / n
        spark.stop()

        print(result)
