from django.contrib import admin
from olwidget.admin import GeoModelAdmin
from django.contrib.gis import admin as gisadmin
from routes.models import Route

class RouteGeoAdmin(GeoModelAdmin):
    options = {
        'layers': ['osm.mapnik'],
        'default_lon': 4984407.8602745,
        'default_lat': 5117309.6559976,
        'default_zoom': 13,
        'zoom_to_data_extent': False,
        'map_options': {
            'projection': 'EPSG:3857',
            'display_projection': 'EPSG:3857',
        }
    }
admin.site.register(Route,gisadmin.OSMGeoAdmin)
#admin.site.register(Route,GeoModelAdmin)
