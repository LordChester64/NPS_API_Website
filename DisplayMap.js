function displayMap(thisLocation, isCampground) {
    var iconType;
    var point = parseLatLong(thisLocation.latLong);
    mapboxgl.accessToken = `${getToken(tokens.MAP, tokens.prefix)}`;
    var map = new mapboxgl.Map({
        container: 'map', // container id
        style: 'mapbox://styles/mapbox/streets-v11', // stylesheet location
        center: [point.long, point.lat], // starting position [lng, lat]
        zoom: 9 // starting zoom
    });
    if (isCampground) {
        iconType = "campsite";
    } else {
        iconType = "flag";
    }
    map.on('load', function() {
        map.loadImage(`./images/${iconType}.jpeg`, function(error, image) {
            if (error) throw error;
            map.addImage(`${iconType}`, image);
            map.addLayer({
                "id": "points",
                "type": "symbol",
                "source": {
                    "type": "geojson",
                    "data": {
                        "type": "FeatureCollection",
                        "features": [{
                            "type": "Feature",
                            "geometry": {
                                "type": "Point",
                                "coordinates": [point.long, point.lat]
                            }
                        }]
                    }
                },
                "layout": {
                    "icon-image": `${iconType}`,
                    "icon-size": 0.1
                }
            });
        });
    });
}

function parseLatLong(latLong) {
    var point = { lat: 0, long: 0 };
    if (latLong.length > 0) {
        var coordinates = latLong.split(",");
        point.lat = parseFloat(coordinates[0].split(":")[1]);
        point.long = parseFloat(coordinates[1].split(":")[1].replace("}", ""));
    }
    return point;
}