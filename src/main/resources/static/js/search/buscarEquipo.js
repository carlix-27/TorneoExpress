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
