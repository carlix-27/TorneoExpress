let userLat, userLng, map, userMarker;

document.addEventListener("DOMContentLoaded", () => {
    // Load Google Maps API and initialize autocomplete for location search
    fetchAndLoadGoogleMapsAPI()
        .then(() => {
            initializeAutocomplete('location');
        })
        .catch(error => {
            console.error("Error loading Google Maps API:", error);
            showErrorToast("Error loading location services.", "error");
        });

    // Fetch user information based on the user ID in localStorage
    const userId = localStorage.getItem("userId");
    if (userId) {
        fetchUserInfo(userId);
    } else {
        console.error("User ID not found in localStorage.");
    }
});

function fetchUserInfo(userId) {
    fetch(`/api/user/players/${userId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch user info: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(player => {
            // Assuming the player's location is a string "lat,long"
            const location = player.location; // Example: "40.730610,-73.935242"
            const [lat, lng] = location.split(',').map(Number);

            if (!isNaN(lat) && !isNaN(lng)) {
                userLat = lat;
                userLng = lng;
                fetchActiveTeams();
                initializeMap();
            } else {
                console.error("Invalid location format for user.");
            }
        })
        .catch(error => {
            console.error('Error fetching user info:', error);
            showErrorToast('Unable to retrieve user information.', 'error');
        });
}

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
        });
}

function renderTeams(teams) {
    const teamList = document.getElementById("lista-equipos");
    teamList.innerHTML = "";

    teams.forEach(function (team) {
        const [teamLat, teamLng] = team.location.split(',').map(Number);

        if (isNaN(teamLat) || isNaN(teamLng)) {
            console.error('Invalid team location:', team.location);
            return;
        }

        // Get the readable address for the team using reverse geocoding
        reverseGeocode(teamLat, teamLng)
            .then(address => {
                // Render the team information in the list
                const listItem = document.createElement("li");
                listItem.innerHTML = `
                    <a href="loadTeam.html?id=${team.id}">
                        <h3>${team.name}</h3>
                    </a>
                    <p>Ubicación: ${address}</p>
                    <p>Deporte: ${team.sport.sportName}</p>
                `;
                teamList.appendChild(listItem);

                // Only render nearby teams (within 50 km of the user)
                const distance = getDistanceFromLatLonInKm(userLat, userLng, teamLat, teamLng);
                if (distance <= 50) {
                    addMarker(team, teamLat, teamLng, address, distance);
                }
            })
            .catch(error => {
                console.error('Error reverse geocoding team location:', error);
                // Fallback to raw coordinates if reverse geocoding fails
                const listItem = document.createElement("li");
                listItem.innerHTML = `
                    <a href="loadTeam.html?id=${team.id}">
                        <h3>${team.name}</h3>
                    </a>
                    <p>Ubicación: ${team.location}</p>
                    <p>Deporte: ${team.sport.sportName}</p>
                `;
                teamList.appendChild(listItem);
            });
    });
}

function initializeMap() {
    const mapOptions = {
        center: { lat: userLat, lng: userLng },
        zoom: 12,
    };

    map = new google.maps.Map(document.getElementById("map"), mapOptions);

    // Add marker for the user's location
    userMarker = new google.maps.Marker({
        position: { lat: userLat, lng: userLng },
        map: map,
        title: "Your Location",
        icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: "blue",
            fillOpacity: 1,
            strokeWeight: 2
        }
    });
}

function addMarker(team, lat, lng, address, distance) {
    const marker = new google.maps.Marker({
        position: { lat: lat, lng: lng },
        map: map,
        title: `${team.name} - ${address}`,
    });

    const infowindow = new google.maps.InfoWindow({
        content: `
            <h4>${team.name}</h4>
            <p>Ubicación: ${address}</p>
            <p>Distancia: ${distance.toFixed(2)} km</p>
        `
    });

    marker.addListener("click", function() {
        infowindow.open(map, marker);
    });
}

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const lat1Rad = degToRad(lat1);
    const lon1Rad = degToRad(lon1);
    const lat2Rad = degToRad(lat2);
    const lon2Rad = degToRad(lon2);

    const dLat = lat2Rad - lat1Rad;
    const dLon = lon2Rad - lon1Rad;

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1Rad) * Math.cos(lat2Rad) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
}

function degToRad(deg) {
    return deg * (Math.PI / 180);
}
