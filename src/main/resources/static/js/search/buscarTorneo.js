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

function addMarker(location, title) {
    const marker = new google.maps.Marker({
        position: location,
        map: map,
        title: title,
    });
    markers.push(marker);
}

function fetchActiveTournaments() {
    fetch('/api/tournaments/active')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch active tournaments: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(tournaments => renderTournaments(tournaments))
        .catch(error => {
            console.error('Error:', error);
            displayErrorMessage('Error fetching tournaments.');
        });
}

function renderTournaments(tournaments) {
    const tournamentList = document.getElementById("tournament-list");
    tournamentList.innerHTML = ""; // Clear previous results

    tournaments.forEach(function (tournament) {
        const listItem = document.createElement("li");

        const geocoder = new google.maps.Geocoder();
        const [lat, lng] = tournament.location.split(',').map(Number);
        const latLng = { lat: lat, lng: lng };

        geocoder.geocode({ location: latLng }, function (results, status) {
            if (status === "OK") {
                if (results[0]) {
                    let formattedAddress = results[0].formatted_address.split(', ').slice(1).join(', ');
                    const tournamentSport = tournament.sport
                    const sportName = tournamentSport.sportName
                    listItem.innerHTML = `<a href="loadTournament.html?id=${tournament.id}"><h3>${tournament.name}</h3></a><p>Ubicacon: ${formattedAddress}</p><p>Deporte: ${sportName}</p>`;
                } else {
                    listItem.innerHTML = `<h3>${tournament.name}</h3><p>Location not found</p>`;
                }
            } else {
                listItem.innerHTML = `<h3>${tournament.name}</h3><p>Geocoder failed due to: ${status}</p>`;
            }
            tournamentList.appendChild(listItem);
        });

        addMarker(latLng, tournament.name);
    });
}


function filterTournaments(event) {
    event.preventDefault(); // Prevent form submission

    const form = document.getElementById("find-tournament-form");
    const tournamentName = form.querySelector("#tournament-name").value.trim().toLowerCase();
    const tournamentType = form.querySelector("#tournament-type").value;
    const tournamentSport = form.querySelector("#tournament-sport").value.trim().toLowerCase();
    const locationInput = form.querySelector("#location");

    if (!locationInput.value.trim()) {
        locationInput.dataset.latitude = "";
        locationInput.dataset.longitude = "";
    }

    const userLat = parseFloat(locationInput.dataset.latitude);
    const userLng = parseFloat(locationInput.dataset.longitude);
    const locationProvided = !isNaN(userLat) && !isNaN(userLng);

    fetch('/api/tournaments/active')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch active tournaments: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(tournaments => {
            const filteredTournaments = tournaments.filter(function (tournament) {
                const lowerCaseTournamentName = tournament.name.toLowerCase();
                const lowerCaseTournamentSport = tournament.sport.sportName.toLowerCase();

                const nameMatches = lowerCaseTournamentName.includes(tournamentName) || tournamentName === "";
                const typeMatches = tournamentType === "all" || (tournament.private && tournamentType === "private") || (!tournament.private && tournamentType === "public");
                const sportMatches = lowerCaseTournamentSport.includes(tournamentSport) || tournamentSport === "";

                if (!locationProvided) {
                    return nameMatches && typeMatches && sportMatches;
                } else {
                    const [tournamentLat, tournamentLng] = tournament.location.split(',').map(Number);
                    if (isNaN(tournamentLat) || isNaN(tournamentLng)) {
                        console.error('Invalid tournament location:', tournament.location);
                        return false;
                    }
                    const distance = getDistanceFromLatLonInKm(userLat, userLng, tournamentLat, tournamentLng);
                    const withinRadius = distance <= 50; // Set the radius in km (e.g., 50 km)
                    return nameMatches && typeMatches && sportMatches && withinRadius;
                }
            });

            renderTournaments(filteredTournaments);
        })
        .catch(error => {
            console.error('Error:', error);
            displayErrorMessage('Error filtering tournaments.');
        });
}


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

// Fetch Google Maps API key and initialize autocomplete
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

// Event listener for form submission
const form = document.getElementById("find-tournament-form");
form.addEventListener("submit", filterTournaments);

// Fetch active tournaments when the page loads
fetchActiveTournaments();