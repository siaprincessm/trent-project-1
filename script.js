let nearByPlaces = [];

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

function listNearbyPlacesContainer(places, icon) {
    var nearbyPlacesContainer = document.getElementById('nearby-places-container');

    let placeList = '';

    nearByMarkers.forEach(function (marker) {
        nearbyMarkersCluster.removeLayer(marker);
    });

    nearByMarkers = [];

    if(places.length > 0) {
        nearbyPlacesContainer.innerHTML = '';

        places.forEach(function (place) {
    
            var markerOptions = {
                title: place.name,
                clickable: true,
                draggable: false,
                icon: icon
            };
    
            var placeMarker = L.marker([place.geocodes.main.latitude, place.geocodes.main.longitude], markerOptions);
    
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

function setupAutoComplete() {
    // setup search bar
    new Autocomplete("search", {
        selectFirst: false,
        // The number of characters entered should start searching
        howManyCharacters: 3,

        onSearch: ({ currentValue }) => {
            const api = 'https://api.foursquare.com/v3/places/search?query=' + encodeURI(currentValue);

            return axios.get(api, {
                headers: {
                    Authorization: "fsq3XWxjy43Yyw+mFjBG60wWVmyPQqhXP8LacGNJHyLE/lU=",
                    Accept: "application/json"
                }
            })
                .then((response) => {
                    return response.data.results;
                })
                .catch(error => {
                    console.log(error);
                });
        },
        onResults: ({ currentValue, matches, template }) => {
            return matches === 0
                ? template
                : matches
                    .map(function (element) {
                        return '<li class="loupe"><p><b>' + element.name + '</b>  <span>' + element.location.address + ', ' + element.location.locality + '<span></p></li>';
                    })
                    .join("");
        },
        onSubmit: ({ object }) => {
            
            map.removeLayer(searchResultMarker);

            searchResultMarker = L.marker([object.geocodes.main.latitude, object.geocodes.main.longitude], {
                title: object.name,
            });

            searchResultMarker.addTo(map).bindPopup(object.name);

            map.setView([object.geocodes.main.latitude, object.geocodes.main.longitude], 13);

            nearByPlaces = [];

            axios.get('https://api.foursquare.com/v3/places/search?categories=13065,19014,17114,12000&radius=10000', {
                headers: {
                    Authorization: "fsq3XWxjy43Yyw+mFjBG60wWVmyPQqhXP8LacGNJHyLE/lU=",
                    Accept: "application/json"
                }
            })
                .then((response) => {
                    nearByPlaces = response.data.results;
                    listNearbyPlacesContainer(nearByPlaces, foodIcon);
                })
                .catch(error => {
                    console.log(error);
                });
        },
        onSelectedItem: ({ index, element, object }) => {
            console.log("onSelectedItem:", index, element, object);
        },
        onReset: () => {

            nearByMarkers.forEach(function (marker) {
                nearbyMarkersCluster.removeLayer(marker);
            });

            map.removeLayer(searchResultMarker);

            nearByMarkers = [];

            document.getElementById('nearby-places-container').innerHTML = '<span>No search data</span>';

            nearByPlaces = [];
        },
        noResults: ({ currentValue, template }) =>
            template(`<li>No results found: "${currentValue}"</li>`),
    });
}