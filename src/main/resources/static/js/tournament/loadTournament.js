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
            const teams = tournament.participatingTeams;
            const teamsList = teams.map(team => `<li><a href="loadTeam.html?id=${team.id}">${team.name}</a></li>`).join('');
            const maxTeams = tournament.maxTeams


            tournamentList.innerHTML = `
                <div id="result">
                    <h2>${tournamentName}</h2>
                    <p>Ubicación: ${location}</p>
                    <p>Dificultad: ${difficulty}</p>
                    <p>Privacidad: ${isPrivate ? "Privado" : "Público"}</p>
                    <p>Inicio: ${startDate}</p>
                    <p>Número máximo de equipos: ${maxTeams}</p>
                    <p>Equipos anotados:</p>
                    <ul>${teamsList}</ul>
                    <a href="calendario.html?id=${tournament.id}"><h3>Ver calendario</h3></a>
                </div>
            `;
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

document.addEventListener("DOMContentLoaded", loadTournament);
