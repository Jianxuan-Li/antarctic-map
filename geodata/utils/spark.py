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
        spark_conf.set("spark.driver.host", "spark-driver")
        spark_conf.set("spark.driver.port", 7077)
        spark_conf.set("spark.kubernetes.driver.pod.name", "spark-driver-pod")
        spark_conf.set("spark.kubernetes.allocation.batch.size", 5)
        spark_conf.set("spark.kubernetes.driver.request.cores", 0.1)
        spark_conf.set("spark.kubernetes.driver.limit.cores", 0.5)
        spark_conf.set("spark.kubernetes.executor.request.cores", 0.1)
        spark_conf.set("spark.kubernetes.executor.limit.cores", 0.5)
        
        spark_session = SparkSession.builder.config(conf=spark_conf).getOrCreate()
        return spark_session

        # For exists spark cluster
        # return SparkSession\
        #         .builder\
        #         .master(settings.SPARK_MASTER)\
        #         .appName(app_name).getOrCreate()
