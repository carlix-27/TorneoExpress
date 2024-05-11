document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("find-team-form");
    const teamList = document.getElementById("lista-equipos");

    // Function to fetch active teams
    function fetchActiveTeams() {
        fetch('/api/teams/allTeams')  // Corrected path
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to fetch active teams: ${response.status} ${response.statusText}`);
                }
                return response.json();
            })
            .then(teams => {
                console.log("Fetched teams:", teams);
                renderTeams(teams);
            })
            .catch(error => {
                console.error('Error:', error);
                // Handle the error, display a message to the user
            });
    }

    // Function to render teams
    function renderTeams(teams) {
        teamList.innerHTML = ""; // Clear previous results

        teams.forEach(function (team) {
            const listItem = document.createElement("li");
            listItem.textContent = team.name + " - " + team.location;
            teamList.appendChild(listItem);
        });
    }

    // Function to filter teams based on user input
    // Function to filter teams based on user input
    function filterTeams(event) {
        event.preventDefault(); // Prevent form submission

        console.log("Filtering teams...");

        const teamName = form.querySelector("#team-name").value.trim().toLowerCase();
        const teamLocation = form.querySelector("#team-location").value.trim().toLowerCase();
        const teamIsPrivate = form.querySelector("#team-isPrivate").value;

        console.log("Name:", teamName);
        console.log("Location:", teamLocation);
        console.log("Privacy:", teamIsPrivate);

        // Fetch all teams from the server
        fetch("/api/teams/allTeams")
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to fetch teams: ${response.status} ${response.statusText}`);
                }
                return response.json();
            })
            .then(teams => {
                console.log("Fetched teams:", teams);

                // Filter teams based on user input
                const filteredTeams = teams.filter(function (team) {
                    // Convert filter values to lower case for case-insensitive matching
                    const lowerCaseTeamName = team.name.toLowerCase();
                    const lowerCaseTeamLocation = team.location.toLowerCase();

                    // Check if the team name contains the search query
                    const nameMatches = lowerCaseTeamName.includes(teamName) || teamName === "";

                    // Check if the team location contains the search query
                    const locationMatches = lowerCaseTeamLocation.includes(teamLocation) || teamLocation === "";

                    // Check if the team privacy matches the selected value
                    const isPrivateMatches = teamIsPrivate === "all" || (team.isPrivate && teamIsPrivate ==="private") || (!team.isPrivate && teamIsPrivate === "public");

                    return nameMatches && locationMatches && isPrivateMatches;
                });

                console.log("Filtered teams:", filteredTeams);

                // Render filtered teams
                renderTeams(filteredTeams);
            })
            .catch(error => {
                console.error('Error:', error);
                // Handle the error, display a message to the user
            });
    }

    // Event listener for form submission
    form.addEventListener("submit", filterTeams);

    // Fetch active teams when the page loads
    fetchActiveTeams();
});
