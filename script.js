let nearByFood = [];
let nearByAccommodation = [];
let nearByShopping = [];
let nearByServices = [];

let hideNearbyPlacesMarkers = false;
let nearByMarkers = [];

let searchResultMarker = {};

let centerpoint = [14.5995, 120.9842];
let map = L.map('map', { zoomControl: false });
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

tileLayer.addTo(map);

let nearbyMarkersCluster = L.markerClusterGroup();

map.addLayer(nearbyMarkersCluster);

axios.get('assets/regions.0.01.json')
    .then(function(response) {
        response.data.features.forEach(region => {
            L.geoJSON(region, {fillOpacity: 0.0}).addTo(map);
        });
})
.catch(function(error) {
    console.log(error);
});

document.getElementById('zoom-in').onclick = function() {
map.setZoom(map.getZoom() + 1);
};

document.getElementById('zoom-out').onclick = function() {
map.setZoom(map.getZoom() - 1);
};

var foodIconOptions = {
iconUrl: './assets/utensils-solid.png',
iconSize: [20, 20]
};

var foodIcon = L.icon(foodIconOptions);

var accommodationIconOptions = {
iconUrl: './assets/hotel-solid.png',
iconSize: [20, 20]
};

var accommodationIcon = L.icon(accommodationIconOptions);

var shoppingIconOptions = {
iconUrl: './assets/cart-shopping-solid.png',
iconSize: [20, 20]
};

var shoppingIcon = L.icon(shoppingIconOptions);

var servicesIconOptions = {
iconUrl: './assets/building-solid.png',
iconSize: [20, 20]
};

var servicesIcon = L.icon(servicesIconOptions);

setupNav();
setupAutoComplete();

document.getElementById('hide-markers-toggle').addEventListener("change", (e) => {
    if (e.target.checked) {
        hideNearbyPlacesMarkers = true;

        nearByMarkers.forEach(function (marker) {
            nearbyMarkersCluster.removeLayer(marker);
        });
    } else {
        hideNearbyPlacesMarkers = false;

        nearByMarkers.forEach(function (marker) {
            // marker.addTo(map);
        nearbyMarkersCluster.addLayer(marker);
        });

    }
});

function setupNav() {
    Array.from(document.getElementsByClassName('nav-link')).forEach(function (e) {
        e.onclick = navClick;
    });
}

function navClick() {
    document.querySelector(".nav-item > .active").classList.remove("active");
    this.classList.add('active');


    if (this.id == 'food-tab') {
        listNearbyPlacesContainer(nearByFood, foodIcon);
    }

    if (this.id == 'accommodation-tab') {
        listNearbyPlacesContainer(nearByAccommodation, accommodationIcon);
    }

    if (this.id == 'shopping-tab') {
        listNearbyPlacesContainer(nearByShopping, shoppingIcon);
    }

    if (this.id == 'services-tab') {
        listNearbyPlacesContainer(nearByServices, servicesIcon);
    }
}