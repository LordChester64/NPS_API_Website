import Map from 'Maps/ol/Map.js';
import View from 'Maps/ol/View.js';
import TileLayer from 'Maps/ol/layer/Tile.js';
import OSM from 'Maps/ol/source/OSM.js';

function drawMap(){
    var map = new Map({
    layers: [
        new TileLayer({
        source: new OSM()
        })
    ],
    target: 'map',
    view: new View({
        center: [0, 0],
        zoom: 2
    })
    });
}