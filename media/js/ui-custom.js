// Trace along a path.
// Uses two global array of tracer objects and a global animation
// id, because I don't understand Javascript well enough to get it
// to work any other way using window.setInterval().
var allTracers = new Array(0); 
var animationID = null; 
function tracePath(layer, lineString){
    // Class to provide separate drawing context for each
    // path so that we can draw multiple at once.
    function PathTracer(fromFeatr, toFeatr, canvas,fromLyr){
        this.from = fromFeatr;
        this.to = toFeatr;
        this.canvas = canvas;
        this.layer = fromLyr;
        this.id = null;
    }
    PathTracer.prototype.step = function() {
            if(this.to.geometry.components.length == this.from.length){ // i.e. copy complete
                this.finish();
                return true;
            }
            this.to.geometry.components.push(this.from[this.to.geometry.components.length]);
            this.canvas.drawFeature(this.to);
            return false;
        }
    PathTracer.prototype.finish = function() {
            if(this.id === null){
                return;
            }
            //window.clearInterval(this.id);
            this.to.destroy();
            this.canvas.redraw();
            this.layer.setVisibility(true);
        }
// Set up visibility    
    layer.setVisibility(false); // Turn off the layer we're tracing so we can see
    var drawLayer = myMap.getLayersByName('draw')[0];
    myMap.setLayerIndex(drawLayer, myMap.layers.length-2); // Push to top of layer stack
    drawLayer.setVisibility(true);
    drawLayer.redraw();
// Get data, construct drawing objects
    var allVerts = lineString.geometry.getVertices();
    var newFeature = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.LineString(new Array(allVerts[0])));
    drawLayer.addFeatures(new Array(newFeature));
    var tracerFeature = drawLayer.features[drawLayer.features.length-1];//Get most recently added feature
// Begin trace    
    var tracer = new PathTracer(allVerts, tracerFeature, drawLayer, layer);
    if(allTracers.length == 0){ // i.e. We're not tracing right now.
        allTracers.push(tracer); // do this now to avoid race condition
        animationID = window.setInterval(animate,25);
        tracer.id = animationID;
    }else{
        allTracers.push(tracer);
        tracer.id = animationID;
    }

// Step through our drawing array 
    function animate() {
        for(var i = 0; i < allTracers.length; i++){
            if(allTracers[i].step()){ // True if done tracing
                var id = allTracers[i].id;
                allTracers.splice(i,1);
                if(allTracers.length == 0) { // Last trace finished
                    window.clearInterval(id);
                }
            }
        }
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

    // Move the layer to the top of the layer stack
    // (leaving the path tracing layer and RootContainer
    // layers above it, hence the -3).
    var moveToTop = function(layer){
        myMap.setLayerIndex(layer,myMap.layers.length-3); 
    }

    // Toggle overlay visibility
    // and return current visibility state (t/f)
    var toggleVis = function() {
        layer = myMap.getLayersByName($(this).attr('name'))[0];
        if(layer.getVisibility()){ 
            layer.setVisibility(false);
            return false;
        }else{
            layer.styleMap.styles["default"].setDefaultStyle(highlight);
            moveToTop(layer);
            layer.setVisibility(true);
            return true;
        }
    }
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

    $('span.toggle-vis').click(function(){
        if(!toggleVis.call(this)){ // not visible
            $(this).parent().removeClass('selected');
            $(this).parent().removeClass('highlight'); // Also remove the mouseover class
            $(this).children("input").removeAttr('checked');
            $(this).siblings("button").attr('disabled',"true");
        }else{
            $(this).parent().addClass('selected');
            $(this).parent().addClass('highlight');
            $(this).children("input").attr('checked',"true");
            $(this).siblings("button").removeAttr('disabled');
        }
    });


    $('button.trace').click(function(){
        layer = myMap.getLayersByName($(this).attr('name'))[0];
        if(layer.getVisibility()){
            window.setTimeout(function(){tracePath(layer, layer.features[0]);},5); // Each layer has only one feature.
        }
        return true;
    });

    // Highlight route during hover over route number
    $('#routes-list li').hover(
        function() { // Mouse-in
            layer = myMap.getLayersByName($(this).attr('name'))[0];
            if(layer.getVisibility()){ // Only bother highlighting if visible
                layer.styleMap.styles["default"].setDefaultStyle(highlight);
                // Set the layer's z-index so it's the topmost
                moveToTop(layer);
                layer.redraw();
                $(this).addClass('highlight');
            }
        },
        function() { // Mouse-out
            layer = myMap.getLayersByName($(this).attr('name'))[0];
            if(layer.getVisibility()){
                layer.styleMap.styles["default"].setDefaultStyle(noHighlight);
                layer.redraw();
                $(this).removeClass('highlight');
            }
        }
    ); // hover
});
