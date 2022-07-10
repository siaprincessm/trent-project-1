function getRandomLatLng(map) {
    // get the boundaries of the map
    let bounds = map.getBounds();
    let southWest = bounds.getSouthWest();
    let northEast = bounds.getNorthEast();
    
    let lngSpan = northEast.lng - southWest.lng;
    let latSpan = northEast.lat - southWest.lat;
    let randomLng = Math.random() * lngSpan + southWest.lng;
    let randomLat = Math.random() * latSpan + southWest.lat;
    return [ randomLat, randomLng,];
}


let centerpoint = [14.5995, 120.9842]
let map = L.map('map');
map.setView(centerpoint, 13);

//create tileLayer
let tileLayer = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw'
})

tileLayer.addTo(map)

let groundZero = L.marker([14.5826, 120.9787]);
groundZero.addTo(map);
groundZero.bindPopup(`Rizal Park`)


// create cluster markings
let randomMarker = L.layerGroup();
for (let i = 0; i < 10; i++) {
    L.marker(getRandomLatLng(map)).addTo(randomMarker);
}
randomMarker.addTo(map);

//random circle group
let greenRandomCircle = L.layerGroup();
for (let i=0; i < 15; i++) {
    L.circle(getRandomLatLng(map),{
    'radius':250,
    'color': 'green'
}).addTo(greenRandomCircle)
}
greenRandomCircle.addTo(map);

//random yellow circle
let yellowRandomCircle = L.layerGroup();
for (let i=0; i < 15; i++) {
    L.circle(getRandomLatLng(map),{
    'radius':400,
    'color': 'yellow'
}).addTo(yellowRandomCircle)
}
yellowRandomCircle.addTo(map);

//base layers
let baseLayers = {
    'markers' : randomMarker,
    'circle' : greenRandomCircle,
}
L.control.layers(baseLayers,{}).addTo(map);