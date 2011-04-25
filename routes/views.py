from django.shortcuts import render_to_response, get_object_or_404
from olwidget.widgets import Map, InfoLayer
from routes.models import Route,Path
from django.contrib.gis.geos import Point, LineString, fromstr
from django.core import serializers
from django.http import HttpResponse

# TODO: Stop using olwidget; render JS directly.
def main(request):
    # get all routes
    all_routes = Route.objects.all().filter(is_active=True)
    
    # construct olwidget layers from routes
    route_layers = []
    for route in all_routes:
        route_layers.append(InfoLayer([[route.path.geometry, route.name]],{'name': route.name}))

    # Dummy layer for drawing; erased later.
    # Using actual Tbilisi data so we don't land somewhere
    # random if something bad happens...although
    # that might be a good indication something broke.
    dummy_geom = fromstr('LINESTRING (4978262.6790810525417328 5118097.6463875807821751,4978283.0049614785239100 5118077.6137111270800233)', srid=3857)
    #dummy_geom = fromstr('LINESTRING (44.792998 41.709981,44.82421875 41.70624114327587',srid=4326)
    route_layers.append(InfoLayer([[dummy_geom, 'draw']],
                                  {'name':'draw'}))
    # construct olwidget map 
    olmap = Map(vector_layers=route_layers,options={'map_div_style':{'background-color': 'white'},
            'map_options': {
                'controls': ['Navigation','PanZoom'], 'display_projection':'EPSG:3857'}},
                #'controls': ['Navigation','PanZoom'], 'display_projection':'EPSG:4326'}},
        template='olwidget-custom.html')
    # render
    return render_to_response('main.html', {'olmap':olmap,'routes':all_routes,})

# We're crowdsourcing Paths, so this view will dump all paths in the db
# to JSON in case of malicious users or mistakes.
def backup(request):
    all_paths = Path.objects.all()
    response = HttpResponse()
    response['mimetype'] = 'application/json'
    json_srlzr = serializers.get_serializer("json")()
    json_srlzr.serialize(all_paths, ensure_ascii=False, stream=response)
    return response
