import{showSignupModal} from 'getAllTeams.js'

export function loadTeams() {
    fetch(`/api/teams/all`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch teams: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(teams => {
            const listaEquipos = document.getElementById("lista-todos-equipos");

            listaEquipos.innerHTML = '';

            teams.forEach(team => {

                const li = document.createElement("li");
                li.innerHTML = `
                    <div>
                        <a href="loadTeam.html?id=${team.id}"><h3>${team.name}</h3></a>
                        <p>Ubicación: ${team.location}</p>
                        <p>Deporte: ${team.sport.sportName}</p>
                        <p>Privacidad: ${team.isPrivate ? "Privado" : "Público"}</p>
                        <p>Jugadores inscritos: ${team.players.length} / ${team.sport.num_players * 2}</p>
                        <button class="signup-button" data-team-id="${team.id}">Signup</button>
                `;
                listaEquipos.appendChild(li);
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