from django.conf import settings
from pyspark import SparkConf
from pyspark.sql import SparkSession

def get_spark(app_name):
    if settings.DEBUG is True:
        return SparkSession\
                .builder\
                .appName(app_name)\
                .getOrCreate()
    else:
        # K8s cluster
        spark_conf = SparkConf()
        spark_conf.setMaster(settings.K8S_SPARK)
        spark_conf.setAppName(app_name)
        spark_conf.set("spark.kubernetes.container.image", settings.K8S_SPARK_IMAGE)
        spark_conf.set("spark.kubernetes.namespace", settings.K8S_SPARK_NAMESPACE)
        spark_conf.set("spark.kubernetes.allocation.batch.size", settings.K8S_SPARK_BATCH_SIZE)
        
        spark_session = SparkSession.builder.config(conf=spark_conf).getOrCreate()
        return spark_session

        # For exists spark cluster
        # return SparkSession\
        #         .builder\
        #         .master(settings.SPARK_MASTER)\
        #         .appName(app_name).getOrCreate()
