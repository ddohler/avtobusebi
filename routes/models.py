from django.db import models
from django.contrib.gis.db import models as gismodels
from transmeta import TransMeta

# Create your models here.
class Route(models.Model):
    __metaclass__ = TransMeta

    name = models.CharField(max_length=50)
    desc = models.TextField(max_length=200,blank=True)
    create_date = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)
    
    path = models.ForeignKey('Path')
    stops = models.ManyToManyField('Stop',null=True)
    mode = models.ForeignKey('Mode')

    def __unicode__(self):
        return self.name

    class Meta:
        translate = ('name','desc',)

# Modes of transit (bus, marshrutka, etc.)
class Mode(models.Model):
    __metaclass__ = TransMeta

    name = models.CharField(max_length=30)

    def __unicode__(self):
        return self.name

    class Meta:
        translate = ('name',)

# A stop or station on a route
class Stop(models.Model):
    __metaclass__ = TransMeta

    geometry = gismodels.PointField(srid=3857)
    objects = gismodels.GeoManager()
    desc = models.CharField(max_length=50)

    def __unicode__(self):
        return self.desc

    class Meta:
        translate = ('desc',)

# The path that a given route (or routes) follows
class Path(models.Model):
    __metaclass__ = TransMeta

    geometry = gismodels.LineStringField(srid=3857)
    objects = gismodels.GeoManager()
    desc = models.CharField(max_length=50)

    def __unicode__(self):
        return self.desc

    class Meta:
        translate = ('desc',)
