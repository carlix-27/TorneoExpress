function loadTournament() {
    const urlParams = new URLSearchParams(window.location.search);
    const tournamentId = urlParams.get('id');

    fetch(`/api/tournaments/${tournamentId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch teams: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(tournament => {

            const tournamentList = document.getElementById("tournament-result");


            const tournamentName = tournament.name
            const location = tournament.location
            const difficulty = tournament.difficulty
            const isPrivate = tournament.private
            const startDate = tournament.startDate
            const teams = tournament.participatingTeams.map(team => team.name).join(', ');
            const maxTeams = tournament.maxTeams



            tournamentList.innerHTML = `
                <div id="result">
                    <h2>${tournamentName}</h2>
                    <p>Ubicación: ${location}</p>
                    <p>Dificultad: ${difficulty}</p>
                    <p>Privacidad: ${isPrivate ? "Privado" : "Público"}</p>
                    <p>Inicio: ${startDate}</p>
                    
                    <p>Equipos: ${teams}</p>
                   
                    <p>Numero maximo de equipos: ${maxTeams}</p>
                    <a href="calendario.html?id=${tournament.id}"><h3>Ver calendario</h3></a>
                    <button id="join-button" type="submit">${isPrivate ? "Enviar solicitud" : "Unirse"}</button>
                </div>
            `;

            const joinButton = document.getElementById("join-button");
            joinButton.addEventListener("click", () => {
                joinTournament(tournamentId);
            });
        })
        .catch(error => {
            console.error('Error:', error);
        });
}


function joinTournament(tournamentId) {
    fetch(`/api/tournaments/${tournamentId}/join`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ playerId : localStorage.getItem("userId")} )
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to join team: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            alert('Request to join the tournament was successful!');
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Failed to join the tournament. Please try again.');
        });
}

document.addEventListener("DOMContentLoaded", loadTournament);
