from django.contrib import admin
from olwidget.admin import GeoModelAdmin
from django.contrib.gis import admin as gisadmin
from routes.models import Route, Stop, Mode, Path

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
# Change comments to get text field for batch input
admin.site.register(Route,gisadmin.OSMGeoAdmin)
#admin.site.register(Route)
#admin.site.register(Route,GeoModelAdmin)

# Switch comments to get a text field for direct input
admin.site.register(Stop,gisadmin.OSMGeoAdmin)
#admin.site.register(Stop)

admin.site.register(Mode)

# Switch comments to get a text field for direct input
admin.site.register(Path,gisadmin.OSMGeoAdmin)
#admin.site.register(Path)
