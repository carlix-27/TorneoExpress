function loadTeams() {
    fetch(`/api/teams/all`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch teams: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(teams => {
            const listaEquipos = document.getElementById("lista-todos-equipos");

            listaEquipos.innerHTML = ''; // Clear the list before loading teams

            teams.forEach(team => {
                const listItem = document.createElement("li");

                listItem.innerHTML = `
                        <h3>${team.name}</h3>
                        <p>Ubicación: ${team.location}</p>
                        <p>Deporte: ${team.sport.sportName}</p>
                        <p>Privacidad: ${team.isPrivate ? "Privado" : "Público"}</p>
                        <p>Jugadores inscritos: ${team.players.length} / ${team.sport.num_players * 2}</p>
                        <button class="signup-button" data-team-id="${team.id}">Signup</button>
                `;

                listaEquipos.appendChild(listItem);
            });

            // Attach event listeners to the signup buttons
            document.querySelectorAll('.signup-button').forEach(button => {
                button.addEventListener('click', function () {
                    showSignupModal(this.getAttribute('data-team-id'));
                });
            });
        })
        .catch(error => {
            console.error('Error:', error);
            // Handle error, show message to user
        });
}

// Function to show the signup modal
function showSignupModal(teamId) {
    const modal = document.getElementById("signupModal");
    const closeButton = modal.querySelector(".close");

    // Fetch team details and populate the modal
    fetch(`/api/teams/${teamId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch team details: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(team => {
            const teamDetails = document.getElementById("teamDetails");
            teamDetails.innerHTML = `
                <p><strong>Team Name:</strong> ${team.name}</p>
                <p><strong>Location:</strong> ${team.location}</p>
                <p><strong>Deporte:</strong> ${team.sport.sportName}</p>
                <p><strong>Privacy:</strong> ${team.isPrivate ? "Private" : "Public"}</p>
                <p><strong>Players:</strong> ${team.players.length} / ${team.sport.num_players * 2}</p>
            `;
        })
        .catch(error => {
            console.error("Error:", error);
            // Handle error, show message to user
        });

    // Display the modal
    modal.style.display = "block";

    // Close modal when the close button is clicked
    closeButton.onclick = function () {
        modal.style.display = "none";
    };

    // Close modal when user clicks outside the modal
    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    };
}

// Load the teams when the page loads
document.addEventListener("DOMContentLoaded", loadTeams);
