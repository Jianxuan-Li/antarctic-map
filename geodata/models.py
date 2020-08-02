from django.db import models


class Seaice(models.Model):
    tif_file = models.CharField(max_length=50, blank=False, null=False)
    png_file = models.CharField(max_length=50, blank=False, null=False)
    date = models.DateField(blank=False, null=False)
    ts_created = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'sea_ice'
