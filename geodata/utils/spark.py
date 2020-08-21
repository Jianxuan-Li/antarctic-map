from django.conf import settings
from pyspark.sql import SparkSession


def get_spark(app_name):
    if settings.DEBUG is True:
        return SparkSession\
                .builder\
                .appName(app_name)\
                .getOrCreate()
    else:
        return SparkSession\
                .builder\
                .master(settings.SPARK_MASTER)\
                .appName(app_name).getOrCreate()
