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

        console.log("Filtering teams...");

        const teamName = form.querySelector("#team-name").value.trim().toLowerCase();
        const teamIsPrivate = form.querySelector("#team-isPrivate").value;
        const userLat = parseFloat(form.querySelector("#location").dataset.latitude);
        const userLng = parseFloat(form.querySelector("#location").dataset.longitude);

        const geocoder = new google.maps.Geocoder();
        const userLatLng = { lat: userLat, lng: userLng };

        geocoder.geocode({ location: userLatLng }, function(results, status) {
            if (status === "OK" && results[0]) {
                const userAddress = results[0].formatted_address.toLowerCase();

                fetch("/api/teams/allTeams")
                    .then(response => {
                        if (!response.ok) {
                            throw new Error(`Failed to fetch teams: ${response.status} ${response.statusText}`);
                        }
                        return response.json();
                    })
                    .then(teams => {
                        console.log("Teams:", teams);

                        const reverseGeocodedTeams = teams.map(team => {
                            const [lat, lng] = team.location.split(',').map(Number);
                            const latLng = { lat, lng };

                            return new Promise((resolve, reject) => {
                                geocoder.geocode({ location: latLng }, function(results, status) {
                                    if (status === "OK" && results[0]) {
                                        team.formattedAddress = results[0].formatted_address.toLowerCase();
                                        resolve(team);
                                    } else {
                                        console.error(`Geocoding failed for team location: ${team.location}`);
                                        reject(`Geocoding failed for team location: ${team.location}`);
                                    }
                                });
                            });
                        });

                        Promise.all(reverseGeocodedTeams)
                            .then(teams => {
                                const filteredTeams = teams.filter(team => {
                                    const lowerCaseTeamName = team.name.toLowerCase();
                                    const isPrivateMatches = teamIsPrivate === "all" || (team.isPrivate && teamIsPrivate === "private") || (!team.isPrivate && teamIsPrivate === "public");
                                    const locationMatches = team.formattedAddress.includes(userAddress);
                                    const nameMatches = lowerCaseTeamName.includes(teamName);
                                    return (nameMatches || locationMatches) && isPrivateMatches;
                                });

                                console.log("Filtered Teams: ", filteredTeams);
                                renderTeams(filteredTeams);
                            })
                            .catch(error => {
                                console.error('Error:', error);
                                displayErrorMessage('Error filtering teams.');
                            });
                    })
                    .catch(error => {
                        console.error('Error:', error);
                        displayErrorMessage('Error filtering teams.');
                    });
            } else {
                console.error('Geocoder failed due to: ' + status);
                displayErrorMessage('Error with location geocoding.');
            }
        });
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
    const errorMessage = document.getElementById("errorMessage");
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