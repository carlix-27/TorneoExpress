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
    autocomplete.addListener('place_changed', function () {
        const place = autocomplete.getPlace();
        if (place.geometry) {
            const location = place.geometry.location;
            input.dataset.latitude = location.lat();
            input.dataset.longitude = location.lng();
            map.setCenter(location);
            map.setZoom(12); // Zoom level can be adjusted as needed
            clearMarkers();
            addMarker(location, place.name);
        } else {
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
                    listItem.innerHTML = `<a href="loadTournament.html?id=${tournament.id}"><h3>${tournament.name}</h3></a><p>${formattedAddress}</p>`;
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

    // Fetch active tournaments based on user input
    fetch('/api/tournaments/active')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch active tournaments: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(tournaments => {
            // Filter tournaments based on user input
            const filteredTournaments = tournaments.filter(function (tournament) {
                // Convert filter values to lower case for case-insensitive matching
                const lowerCaseTournamentName = tournament.name.toLowerCase();
                const lowerCaseTournamentSport = tournament.sport.sportName.toLowerCase();

                // Check if the tournament name contains the search query
                const nameMatches = lowerCaseTournamentName.includes(tournamentName.toLowerCase()) || tournamentName === "";

                // Check if the tournament type matches the selected type
                const typeMatches = tournamentType === "all" || (tournament.private && tournamentType === "private") || (!tournament.private && tournamentType === "public");

                // Check if the tournament sport name contains the search query
                const sportMatches = lowerCaseTournamentSport.includes(tournamentSport.toLowerCase()) || tournamentSport === "";

                return nameMatches && typeMatches && sportMatches;
            });

            // Render filtered tournaments
            renderTournaments(filteredTournaments);
        })
        .catch(error => {
            console.error('Error:', error);
            displayErrorMessage('Error filtering tournaments.');
        });
}

function displaySuccessMessage(message) {
    const successMessage = document.getElementById("successMessage");
    successMessage.textContent = message;
    successMessage.style.display = "block";
    setTimeout(() => {
        successMessage.style.display = "none";
    }, 3000);
}

function displayErrorMessage(message) {
    const errorMessage = document.getElementById("errorMessage");
    errorMessage.textContent = message;
    errorMessage.style.display = "block";
    setTimeout(() => {
        errorMessage.style.display = "none";
    }, 3000);
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