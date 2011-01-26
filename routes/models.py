from django.db import models
from django.contrib.gis.db import models as gismodels

# Create your models here.
class Route(models.Model):
    number = models.CharField(max_length=10)
    create_date = models.DateTimeField(auto_now_add=True)
    path = gismodels.LineStringField(srid=2593)
    objects = gismodels.GeoManager()
