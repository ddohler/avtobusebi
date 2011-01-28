from django.contrib import admin
from olwidget.admin import GeoModelAdmin
from routes.models import Route

class RouteGeoAdmin(GeoModelAdmin):
    options = {
        'layers': ['osm.mapnik'],
        'default_lon': 4984407.8602745,
        'default_lat': 5117309.6559976,
        'default_zoom': 13,
        'zoom_to_data_extent': False,
        'map_options': {
            'projection': 'EPSG:900913',
            'display_projection': 'EPSG:900913',
        }
    }
admin.site.register(Route,RouteGeoAdmin)
