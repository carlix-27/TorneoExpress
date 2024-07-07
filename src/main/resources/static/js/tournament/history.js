function cargarHistorialTorneos() {

    fetch(`/api/tournaments/history`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch tournament history: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(tournaments => {
            const listaTorneos = document.getElementById("lista-torneos");
            listaTorneos.innerHTML = "";

            tournaments.forEach(tournament => {
                const li = document.createElement("li");

                const tournamentName = tournament.name
                const tournamentSport = tournament.sport
                const tournamentSportName = tournamentSport.sportName
                const tournamentLocation = tournament.location
                const privateTournament = tournament.private

                const tournamentId = tournament.id;

                const participatingTeams = tournament.participatingTeams
                const numOfParticipatingTeams = participatingTeams.length
                const maxTeams = tournament.maxTeams;


                li.innerHTML = `

        <div>
            <h3>${tournament.name}</h3>
            <p>Deporte: ${tournament.sport.sportName}</p>
            <p>Ubicación: ${tournament.location}</p>
            <p>Privacidad: ${tournament.private ? "Privado" : "Público"}</p>
            <p>Dificultad: ${tournament.difficulty}</p>
            <p>Equipos Participantes: ${tournament.participatingTeams.length}</p>
            <button onclick="verParticipantes(${tournament.id})">Participantes</button>
        </div>
    `;
                listaTorneos.appendChild(li);
            });

        })
        .catch(error => {
            console.error('Error:', error);
        });
}


function verParticipantes(torneoId) {
    window.location.href = `participantes.html?id=${torneoId}`; // En participantes, muestro toda la informacion asociada a los equipos y los partidos que se disputaron en el torneo.
}


document.addEventListener("DOMContentLoaded", cargarHistorialTorneos);
