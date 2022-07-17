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

let foodIconOptions = {
iconUrl: './assets/utensils-solid.png',
iconSize: [20, 20]
};

let foodIcon = L.icon(foodIconOptions);

let accommodationIconOptions = {
iconUrl: './assets/hotel-solid.png',
iconSize: [20, 20]
};

let accommodationIcon = L.icon(accommodationIconOptions);

let shoppingIconOptions = {
iconUrl: './assets/cart-shopping-solid.png',
iconSize: [20, 20]
};

let shoppingIcon = L.icon(shoppingIconOptions);

let servicesIconOptions = {
iconUrl: './assets/building-solid.png',
iconSize: [20, 20]
};

let servicesIcon = L.icon(servicesIconOptions);

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

function listNearbyPlacesContainer(places, icon) {
    let listNearbyPlacesContainer = document.getElementById('nearby-places-container');

    let placeList = '';

    nearByMarkers.forEach(function (marker){
        nearbyMarkersCluster.removeLayer(marker);
    });

    nearByMarkers = []

    if(places.length > 0) {
        nearbyPlacesContainer.innerHTML = '';

        places.forEach(function (place) {
    
            let markerOptions = {
                title: place.name,
                clickable: true,
                draggable: false,
                icon: icon
            };

            let placeMarker = L.marker([place.geocodes.main.latitude, place.geocodes.main.longitude], markerOptions);
    
            placeMarker.bindPopup(place.name + '<br/>' + place.distance / 1000 + 'km');
    
            nearByMarkers.push(placeMarker);
    
            if (hideNearbyPlacesMarkers === false) {
                // placeMarker.addTo(map);

                nearbyMarkersCluster.addLayer(placeMarker);

            }
    
            let placeElement = `<a class="list-group-item list-group-item-action" href="#" onclick="clickNearByPlace(${place.geocodes.main.latitude},${place.geocodes.main.longitude})">
                    <strong>${place.name}</strong> <span> ${place.distance / 1000} km</span><br/>
                    <span>${place.location.formatted_address}</span>
                </a>`;
    
            placeList += placeElement;
        });
    
        nearbyPlacesContainer.innerHTML = '<div class="list-group">' + placeList + '</div>';
    }
}

function clickNearByPlace(lat, lng) {
    map.setView([lat, lng], 13);
}

