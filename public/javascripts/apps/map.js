var exPoint = {};
/*지도*/
function fnMapDrawing(idx, maxIdx, trip, map){
  if (trip == null || typeof trip.payload == 'undefined') return;
  trip.payload.forEach((micro, index) => {
    var vectorLayer = new Tmap.Layer.Vector('VectorLayer', { renderers: ['SVG', 'Canvas', 'VML']});
    var lineLayer = new Tmap.Layer.Vector('LineLayer', { renderers: ['SVG', 'Canvas', 'VML']});
    var markerLayer = new Tmap.Layer.Markers();
    map.addLayers([lineLayer, vectorLayer, markerLayer]);
    var size = new Tmap.Size(25,35);
    var offset = new Tmap.Pixel(-(size.w/2), -(size.h/2));
    var startIcon = new Tmap.IconHtml("<div class='marker start-marker'>출발</div>", size, offset);
    var endIcon = new Tmap.IconHtml("<div class='marker end-marker'>도착</div>", size, offset);

    var maxLon, minLon, maxLat, minLat;
    var coord = [micro.lon, micro.lat];

    maxLon = !maxLon ? coord[0] : coord[0] > maxLon ? coord[0] : maxLon;
    minLon = !minLon ? coord[0] : coord[0] < minLon ? coord[0] : minLon;
    maxLat = !maxLat ? coord[1] : coord[1] > maxLat ? coord[1] : maxLat;
    minLat = !minLat ? coord[1] : coord[1] < minLat ? coord[1] : minLat;

    var point = new Tmap.Geometry.Point(coord[0], coord[1]);
    var pointList = [], featureList = [];

    featureList.push(new Tmap.Feature.Vector(point));
    var lonlat = new Tmap.LonLat(coord[0], coord[1]);

    if (index == 0 && idx == 0) {
      /*출발*/
      var marker = new Tmap.Marker(lonlat, startIcon);
      markerLayer.addMarker(marker);
    } else if (index == trip.payload.length -1 && idx == maxIdx){
      /*도착*/
      var marker = new Tmap.Marker(lonlat, endIcon);
      markerLayer.addMarker(marker);
    }
    if(index == 0 && idx != 0){
      pointList.push(exPoint);
    }

    pointList.push(point);

    micro.event.forEach((e, index) => {
      var eventIcon = new Tmap.IconHtml('<div class="event-marker" style="border-color:red;">'+e+'</div>', new Tmap.Size(40,8), new Tmap.Pixel(10, -10));
      var marker = new Tmap.Marker(lonlat, eventIcon);
      markerLayer.addMarker(marker);
    });

    var lineString = new Tmap.Geometry.LineString(pointList);
    var mLineFeature = new Tmap.Feature.Vector(lineString, null, { strokeWidth: 3 });
    lineLayer.addFeatures([mLineFeature]);
    vectorLayer.addFeatures(featureList);

    map.setCenter(new Tmap.LonLat((maxLon + minLon) / 2, (maxLat + minLat) / 2), 14);

    if(trip.payload.length-1 == index) exPoint = point;
  });
}
