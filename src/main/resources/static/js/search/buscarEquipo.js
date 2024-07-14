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
            console.error('No details available for input: ' + place.name);
        }
    });
    initMap();
}

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: -34.397, lng: 150.644},
        zoom: 8
    });
}

function addMarker(location, teamName) {
    const marker = new google.maps.Marker({
        position: location,
        map: map,
        title: teamName
    });
    markers.push(marker);
}

document.addEventListener("DOMContentLoaded", function() {
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
                console.log("Fetched teams:", teams);
                renderTeams(teams);
                addTeamMarkers(teams);
            })
            .catch(error => {
                console.error('Error:', error);
                displayErrorMessage('Error fetching teams.');
            });
    }

    function renderTeams(teams) {
        teamList.innerHTML = "";
        teams.forEach(function (team) {
            const listItem = document.createElement("li");
            listItem.textContent = team.name + " - " + team.location;
            teamList.appendChild(listItem);
        });
    }

    function filterTeams(event) {
        event.preventDefault();

        const teamName = form.querySelector("#team-name").value.trim().toLowerCase();
        const teamLocation = form.querySelector("#location").value.trim().toLowerCase();
        const teamIsPrivate = form.querySelector("#team-isPrivate").value;
        const latitude = parseFloat(form.querySelector("#location").dataset.latitude);
        const longitude = parseFloat(form.querySelector("#location").dataset.longitude);
        const radius = 10; // radius in kilometers for proximity search

        fetch("/api/teams/allTeams")
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to fetch teams: ${response.status} ${response.statusText}`);
                }
                return response.json();
            })
            .then(teams => {
                const filteredTeams = teams.filter(function (team) {
                    const lowerCaseTeamName = team.name.toLowerCase();
                    const lowerCaseTeamLocation = team.location.toLowerCase();
                    const nameMatches = lowerCaseTeamName.includes(teamName) || teamName === "";
                    const locationMatches = lowerCaseTeamLocation.includes(teamLocation) || teamLocation === "";
                    const isPrivateMatches = teamIsPrivate === "all" || (team.private && teamIsPrivate === "private") || (!team.private && teamIsPrivate === "public");

                    const distance = calculateDistance(latitude, longitude, team.latitude, team.longitude);
                    const isWithinRadius = distance <= radius;

                    return nameMatches && locationMatches && isPrivateMatches && isWithinRadius;
                });

                renderTeams(filteredTeams);
                addTeamMarkers(filteredTeams);
            })
            .catch(error => {
                console.error('Error:', error);
                displayErrorMessage('Error filtering teams.');
            });
    }

    function addTeamMarkers(teams) {
        clearMarkers();
        teams.forEach(team => {
            if (team.latitude && team.longitude) {
                const location = { lat: team.latitude, lng: team.longitude };
                addMarker(location, team.name);
            }
        });
    }

    function clearMarkers() {
        markers.forEach(marker => marker.setMap(null));
        markers = [];
    }

    function calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371; // Radius of the Earth in km
        const dLat = toRadians(lat2 - lat1);
        const dLon = toRadians(lon2 - lon1);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    function toRadians(degrees) {
        return degrees * (Math.PI / 180);
    }

    form.addEventListener("submit", filterTeams);
    fetchActiveTeams();
});

function displaySuccessMessage(message) {
    const successMessage = document.getElementById("successMessage");
    successMessage.textContent = message;
    successMessage.style.display = "block";
    setTimeout(() => {
        successMessage.style.display = "none";
    }, 3000);
}

function displayErrorMessage(message) {
    const errorMessage

        = document.getElementById("errorMessage");
    errorMessage.textContent = message;
    errorMessage.style.display = "block";
    setTimeout(() => {
        errorMessage.style.display = "none";
    }, 3000);
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