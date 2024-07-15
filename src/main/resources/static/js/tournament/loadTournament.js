function loadTournament() {
    const urlParams = new URLSearchParams(window.location.search);
    const tournamentId = urlParams.get('id');

    console.log("Tournament ID: ", tournamentId);

    fetch(`/api/tournaments/${tournamentId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch teams: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(tournament => {

            const tournamentList = document.getElementById("tournament-result");

            console.log("Tournament: ", tournament);

            console.log("Matches del torneo: ", tournament.matches);

            const tournamentName = tournament.name
            const location = tournament.location
            const difficulty = tournament.difficulty
            const isPrivate = tournament.private
            const startDate = tournament.startDate
            const teams = tournament.participatingTeams;
            const teamsList = teams.map(team => `<li><a href="loadTeam.html?id=${team.id}">${team.name}</a></li>`).join('');
            const maxTeams = tournament.maxTeams
            const type = tournament.type

            console.log("Tournament Matches: ", tournament.matches);



            tournamentList.innerHTML = `
                <div id="result">
                    <h2>${tournamentName}</h2>
                    <p>Ubicación: ${location}</p>
                    <p>Dificultad: ${difficulty}</p>
                    <p>Tipo: ${type}</p>
                    <p>Privacidad: ${isPrivate ? "Privado" : "Público"}</p>
                    <p>Inicio: ${startDate}</p>
                    <p>Número máximo de equipos: ${maxTeams}</p>
                    <p>Equipos anotados:</p>
                    <ul>${teamsList}</ul>
                    <a href="calendario.html?id=${tournament.id}"><h3>Ver calendario</h3></a>
                    <a href="verEstadisticas.html?id=${tournament.id}"><h3>Ver estadisticas</h3></a>
                    <a class="action-link" onclick="endTournament(${tournament.id})">Terminar Torneo</a>
                </div> 
            `;
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

document.addEventListener("DOMContentLoaded", loadTournament);

// TODO: El teamWinner lo determinan las estadisticas.
function endTournament(tournamentId){

    console.log("Tournament ID: ", tournamentId);
    // Confirmar finalización del torneo
    if (confirm('¿Estás seguro de que deseas terminar el torneo? Esta acción es irreversible.')) {
        // Enviar datos al servidor para finalizar el torneo
        fetch(`/api/tournaments/${tournamentId}/end`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                tournamentId: tournamentId,
            })
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Display success message in green
                    document.getElementById('success-message').innerText = "Torneo terminado con éxito";
                    document.getElementById('success-message').style.color = 'green';
                    document.getElementById('success-message').style.display = 'block';
                    document.getElementById('error-message').style.display = 'none';
                } else {
                    document.getElementById('error-message').innerText = "Hubo un problema al terminar el torneo";
                    document.getElementById('error-message').style.color = 'red';
                    document.getElementById('error-message').style.display = 'block';
                    document.getElementById('success-message').style.display = 'none';
                }
            })
            .catch(error => {
                console.error('Error:', error);
                document.getElementById('error-message').innerText = "Error al terminar el torneo";
                document.getElementById('error-message').style.color = 'red';
                document.getElementById('error-message').style.display = 'block';
                document.getElementById('success-message').style.display = 'none';
            });
    }
}