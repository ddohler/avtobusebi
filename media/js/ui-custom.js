// Trace along a path.
function tracePath(layer, lineString){
    var drawLayer = myMap.getLayersByName('draw')[0];
    myMap.setLayerIndex(drawLayer, myMap.layers.length-2); // Push to top of layer stack
    drawLayer.setVisibility(true);
    drawLayer.redraw();

    var allVerts = lineString.geometry.getVertices();
    var newFeature = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.LineString(new Array(allVerts[0])));
    drawLayer.addFeatures(new Array(newFeature));
    var tracerFeature = drawLayer.features[0];
    intervalID = window.setInterval(animate,25);

    function animate() {
        if(tracerFeature.geometry.components.length == allVerts.length) { 
            finishTrace();
            return; 
        }
        tracerFeature.geometry.components.push(allVerts[tracerFeature.geometry.components.length]);
        drawLayer.drawFeature(tracerFeature);
    }

    function finishTrace(){
        window.clearInterval(intervalID)
            drawLayer.removeFeatures(tracerFeature);
        tracerFeature.destroy();
        drawLayer.redraw();
        //drawLayer.setVisibility(false);
        layer.setVisibility(true);
    }
}

// Use JQuery to perform setup after page loads
$(document).ready(function(){ // Hide/Show overlays on clicking corresponding <li>s.
    // Toggle color change on mouseover
    var highlight = {
    'fillColor': '#ff0000',
    'fillOpacity': 0.5,
    'pointRadius': 6,
    'strokeColor': '#ff0000',
    'strokeWidth': 2
    };
    var noHighlight = {
    'fillColor': '#5d797e',
    'fillOpacity': 0.5,
    'pointRadius': 6,
    'strokeColor': '#5d797e',
    'strokeWidth': 2
    };

    // Turn off all overlays to start
    // I would rather put all the geometries in one layer
    // because I suspect it would save memory and boost
    // performance, but there doesn't seem to be an easy
    // way to do that with OpenLayers 2.10 and the current
    // version of oldwidget.
    for(i=1; i<myMap.layers.length-1; i++) { // Skip base layer(0) and last layer, which is apparently important.
        var layer = myMap.layers[i];
        layer.setVisibility(false);
        layer.styleMap.styles["default"].setDefaultStyle(noHighlight);
    }
    myMap.getLayersByName('draw')[0].styleMap.styles["default"].setDefaultStyle(highlight);
    // Toggle overlay when corresponding route number is clicked
    $('#routes-list li').click(function() { 
        layer = myMap.getLayersByName($(this).html())[0];
        if(layer.getVisibility()){ 
        $(this).removeClass('selected');
        $(this).removeClass('highlight'); // Also remove the mouseover class
        layer.setVisibility(false);
        }else{
        $(this).addClass('selected');
        $(this).addClass('highlight');
        //layer.setVisibility(true);
        tracePath(layer, layer.features[0]); // Each layer has only one feature.
        }
        }); // click

    // Highlight route during hover over route number
    $('#routes-list li').hover(
        function() { // Mouse-in
        layer = myMap.getLayersByName($(this).html())[0];
        if(layer.getVisibility()){ // Only bother highlighting if visible
        layer.styleMap.styles["default"].setDefaultStyle(highlight);
        // Set the layer's z-index to just above the z-index of the topmost
        // overlay (leaving the path tracing layer and RootContainer
        // layers above it, hence the -3).
        myMap.setLayerIndex(layer,myMap.layers.length-3); 
        layer.redraw();
        $(this).addClass('highlight');
        }
        },
        function() { // Mouse-out
        layer = myMap.getLayersByName($(this).html())[0];
        if(layer.getVisibility()){
        layer.styleMap.styles["default"].setDefaultStyle(noHighlight);
        layer.redraw();
        $(this).removeClass('highlight');
        }
        }
    ); // hover
});
