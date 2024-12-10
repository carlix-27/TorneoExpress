let autocomplete;
let map;
let markers = [];

function initAutocomplete(apiKey) {
    const input = document.getElementById('location');
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initializeAutocomplete`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
}

function initializeAutocomplete() {
    const input = document.getElementById('location');
    if (!input) {
        console.error("No input element with ID 'location' found.");
        return;
    }
    autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete.addListener('place_changed', function() {
        const place = autocomplete.getPlace();
        if (place.geometry) {
            const location = place.geometry.location;
            input.dataset.latitude = location.lat();
            input.dataset.longitude = location.lng();
        } else {
            input.dataset.latitude = "";
            input.dataset.longitude = "";
            console.error('No details available for input: ' + place.name);
        }
    });

    initMap();
}

function initMap() {
    const mapOptions = {
        zoom: 6,
        center: { lat: 40.416775, lng: -3.70379 }, // Centered on Spain by default
    };
    map = new google.maps.Map(document.getElementById('map'), mapOptions);
}

function clearMarkers() {
    markers.forEach(marker => marker.setMap(null));
    markers = [];
}

function addMarker(location, title) {
    const marker = new google.maps.Marker({
        position: location,
        map: map,
        title: title,
    });
    markers.push(marker);
}

document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("find-team-form");
    const teamList = document.getElementById("lista-equipos");

    function fetchActiveTeams() {
        fetch('/api/teams/allTeams')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to fetch active teams: ${response.status} ${response.statusText}`);
                }
                return response.json();
            })
            .then(teams => {
                renderTeams(teams);
            })
            .catch(error => {
                console.error('Error:', error);
                displayErrorMessage('Error fetching teams.');
            });
    }

    function renderTeams(teams) {
        teamList.innerHTML = "";
        clearMarkers();

        teams.forEach(function (team) {
            const listItem = document.createElement("li");

            const geocoder = new google.maps.Geocoder();
            const [lat, lng] = team.location.split(',').map(Number);
            const latLng = {lat: lat, lng: lng};

            geocoder.geocode({location: latLng}, function (results, status) {
                if (status === "OK") {
                    if (results[0]) {
                        let formattedAddress = results[0].formatted_address.split(', ').slice(1).join(', ');
                        listItem.innerHTML = `<a href="loadTeam.html?id=${team.id}"><h3>${team.name}</h3></a><p>${formattedAddress}</p>`;
                    } else {
                        listItem.innerHTML = `<h3>${team.name}</h3><p>Location not found</p>`;
                    }
                } else {
                    listItem.innerHTML = `<h3>${team.name}</h3><p>Geocoder failed due to: ${status}</p>`;
                }
                teamList.appendChild(listItem);
            });

            addMarker(latLng, team.name);
        });
    }

    function filterTeams(event) {
        event.preventDefault();

        const teamName = form.querySelector("#team-name").value.trim().toLowerCase();
        const teamIsPrivate = form.querySelector("#team-isPrivate").value;
        const locationInput = form.querySelector("#location");

        if (!locationInput.value.trim()) {
            locationInput.dataset.latitude = "";
            locationInput.dataset.longitude = "";
        }

        const userLat = parseFloat(locationInput.dataset.latitude);
        const userLng = parseFloat(locationInput.dataset.longitude);
        const locationProvided = !isNaN(userLat) && !isNaN(userLng);

        fetch("/api/teams/allTeams")
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to fetch teams: ${response.status} ${response.statusText}`);
                }
                return response.json();
            })
            .then(teams => {
                const filteredTeams = teams.filter(team => {
                    const lowerCaseTeamName = team.name.toLowerCase();
                    const isPrivateMatches = teamIsPrivate === "all" ||
                        (team.private && teamIsPrivate === "private") ||
                        (!team.private && teamIsPrivate === "public");
                    const nameMatches = lowerCaseTeamName.includes(teamName);

                    if (!locationProvided) {
                        return nameMatches && isPrivateMatches;
                    } else {
                        const [teamLat, teamLng] = team.location.split(',').map(Number);
                        if (isNaN(teamLat) || isNaN(teamLng)) {
                            console.error('Invalid team location:', team.location);
                            return false;
                        }
                        const distance = getDistanceFromLatLonInKm(userLat, userLng, teamLat, teamLng);
                        const withinRadius = distance <= 50; // Establece el radio en km (por ejemplo, 50 km)
                        return nameMatches && isPrivateMatches && withinRadius;
                    }
                });

                renderTeams(filteredTeams);
            })
            .catch(error => {
                console.error('Error:', error);
                displayErrorMessage('Error filtering teams.');
            });
    }

    form.addEventListener("submit", filterTeams);

    fetchActiveTeams();
});


function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in km
    return distance;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180);
}

document.addEventListener("DOMContentLoaded", function() {
    fetch('/api/googleMapsApiKey')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch API key: ${response.status} ${response.statusText}`);
            }
            return response.text();
        })
        .then(apiKey => {
            initAutocomplete(apiKey);
        })
        .catch(error => {
            console.error('Error fetching API key:', error);
        });
});