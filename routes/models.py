from django.db import models
from django.contrib.gis.db import models as gismodels

# Create your models here.
class Route(models.Model):
    number = models.CharField(max_length=10)
    create_date = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)
    path = gismodels.LineStringField(srid=3857) #EPSG code for the Google or 900913 projection
    objects = gismodels.GeoManager()

    def __unicode__(self):
        return self.number
