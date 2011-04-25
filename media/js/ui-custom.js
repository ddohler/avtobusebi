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
    };

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
            canvas = myMap.getLayersByName('draw')[0];
            pt = new PathTracer(layer.features[0], myMap.getLayersByName('draw')[0],layer); 
            pt.launch(pt);
        }
        return true;
    });

    // Highlight route during hover over route number
    $('#routes-list li').hover(
        function() { // Mouse-in
            layer = myMap.getLayersByName($(this).attr('name'))[0];
            $(this).addClass('highlight');
            layer.styleMap.styles["default"].setDefaultStyle(highlight);
            if(layer.getVisibility()){ // Only bother highlighting if visible
                // Set the layer's z-index so it's the topmost
                moveToTop(layer);
                layer.redraw();
            }
            return true;
        },
        function() { // Mouse-out
            layer = myMap.getLayersByName($(this).attr('name'))[0];
            layer.styleMap.styles["default"].setDefaultStyle(noHighlight);
            $(this).removeClass('highlight');
            if(layer.getVisibility()){
                layer.redraw();
            }
            return true;
        }
    ); // hover
});

// Path Tracing class
function PathTracer(toTrace, canvas, fromLyr){
    this.from = toTrace;
    this.canvas = canvas;
    this.to = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.LineString());
    this.canvas.addFeatures(new Array(this.to));
    this.layer = fromLyr;
    this.id = null;

    this.step = function(){
        this.to.geometry.components.push(this.from.geometry.components[this.to.geometry.components.length]);
        this.canvas.redraw();
    };
    this.launch = function(pt) { 
        this.layer.setVisibility(false);
        this.canvas.setVisibility(true);
        this.id = setInterval(function(){pt.draw.call(pt);},25); 
    };
    this.finish = function() { 
        clearInterval(this.id);
        this.to.destroy();
        this.canvas.redraw();
        this.layer.setVisibility(true);
    };

    this.draw = function() {
        if(this.to.geometry.components.length == this.from.geometry.components.length){
            this.finish.call(this);
        }else{
            this.step.call(this);
        }
    };

    return this;
}
