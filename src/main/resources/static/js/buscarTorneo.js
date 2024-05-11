document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("find-tournament-form");
    const tournamentList = document.getElementById("lista-torneos");

    // Function to fetch active tournaments
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
                // Handle the error, display a message to the user
            });
    }

    // Function to render tournaments
    function renderTournaments(tournaments) {
        tournamentList.innerHTML = ""; // Clear previous results

        tournaments.forEach(function (tournament) {
            const listItem = document.createElement("li");
            listItem.textContent = tournament.name + " - " + tournament.sport.sportName;
            tournamentList.appendChild(listItem);
        });
    }

    // Function to filter tournaments based on user input
    function filterTournaments(event) {
        event.preventDefault(); // Prevent form submission

        console.log("Filtering tournaments...");

        const tournamentName = form.querySelector("#tournament-name").value.trim().toLowerCase();
        const tournamentType = form.querySelector("#tournament-type").value;
        const tournamentSport = form.querySelector("#tournament-sport").value.trim().toLowerCase();

        console.log("Name:", tournamentName);
        console.log("Type:", tournamentType);
        console.log("Sport:", tournamentSport);

        // Fetch active tournaments based on user input
        fetch('/api/tournaments/active')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to fetch active tournaments: ${response.status} ${response.statusText}`);
                }
                return response.json();
            })
            .then(tournaments => {
                console.log("Fetched tournaments:", tournaments);

                // Filter tournaments based on user input
                const filteredTournaments = tournaments.filter(function (tournament) {
                    // Convert filter values to lower case for case-insensitive matching
                    const lowerCaseTournamentName = tournament.name.toLowerCase();
                    const lowerCaseTournamentSport = tournament.sport.sportName.toLowerCase();

                    // Check if the tournament name contains the search query
                    const nameMatches = lowerCaseTournamentName.includes(tournamentName.toLowerCase()) || tournamentName === "";

                    // Check if the tournament type matches the selected type
                    const typeMatches = tournamentType === "all" || (tournament.isPrivate && tournamentType === "private") || (!tournament.isPrivate && tournamentType === "public");

                    // Check if the tournament sport name contains the search query
                    const sportMatches = lowerCaseTournamentSport.includes(tournamentSport.toLowerCase()) || tournamentSport === "";

                    return nameMatches && typeMatches && sportMatches;
                });

                console.log("Filtered tournaments:", filteredTournaments);

                // Render filtered tournaments
                renderTournaments(filteredTournaments);
            })
            .catch(error => {
                console.error('Error:', error);
                // Handle the error, display a message to the user
            });
    }

    // Event listener for form submission
    form.addEventListener("submit", filterTournaments);

    // Fetch active tournaments when the page loads
    fetchActiveTournaments();
});
