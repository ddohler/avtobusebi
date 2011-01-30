from django.shortcuts import render_to_response, get_object_or_404
from olwidget.widgets import Map, InfoLayer
from routes.models import Route
from django.contrib.gis.geos import *

def main(request):
    # get all routes
    all_routes = Route.objects.all().filter(is_active=True)
    
    # construct olwidget layers from routes
    route_layers = []
    for route in all_routes:
        route_layers.append(InfoLayer([[route.path, route.number]],{'name': route.number}))
    # construct olwidget map 
    olmap = Map(vector_layers=route_layers,options={'map_options': {
        'controls': ['Navigation','PanZoom'], 'display_projection':'EPSG:3857'}},
        template='olwidget-custom.html')
    # render
    return render_to_response('main.html', {'olmap':olmap,'routes':all_routes,})
