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

# Types of transit (bus, marshrutka, etc.)
class Mode(models.Model):

    name = models.CharField(max_length=30)

    def __unicode__(self):
        return self.name

# A stop or station
class Stop(models.Model):
    geometry = gismodels.PointField(srid=3857)
    desc = models.CharField(max_length=50)

    def __unicode__(self):
        return self.desc

# A segment of the path that a given route follows
class Path(models.Model):
    geometry = gismodels.LineStringField(srid=3857)
    desc = models.CharField(max_length=50)

    def __unicode__(self):
        return self.desc
