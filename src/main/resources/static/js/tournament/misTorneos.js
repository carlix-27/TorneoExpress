function cargarTorneos() {
    const userId = localStorage.getItem("userId");
    if (!userId) {
        console.error("User ID not found in localStorage");
        return;
    }

    fetch(`/api/tournaments/user/${userId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch tournaments: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(tournaments => {
            const listaTorneos = document.getElementById("lista-torneos");
            listaTorneos.innerHTML = "";

            tournaments.forEach(tournament => {
                const li = document.createElement("li");

                const {
                    name: tournamentName,
                    sport: tournamentSport,
                    location: tournamentLocation,
                    private: privateTournament,
                    id: tournamentId,
                    participatingTeams
                } = tournament

                const numOfParticipatingTeams = participatingTeams.length
                const maxTeams = tournament.maxTeams;
                const sportName = tournamentSport.sportName


                li.innerHTML = `
                
                <div>
                
                    <div>
                    <a href="loadTournament.html?id=${tournament.id}"><h3>${tournamentName}</h3></a> 
                    <p>Deporte: ${sportName}</p>
                    <p>Ubicación: ${tournamentLocation}</p>
                    <p>Privacidad: ${privateTournament ? "Privado" : "Público"}</p>
                    <p>Dificultad: ${tournament.difficulty}</p>
                    <p>Equipos Participantes: ${numOfParticipatingTeams} / ${maxTeams} </p>
                    <button onclick="editarTorneo(${tournament.id})">Editar</button>
                    <button onclick="borrarTorneo(${tournament.id})">Borrar</button>
                    ${privateTournament ? `<button onclick="manejarSolicitudes(${tournamentId})">Manejar Solicitudes</button>` : ''}
                </div>
                
                `;
                listaTorneos.appendChild(li);
            });

        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function editarTorneo(torneoId) {
    window.location.href = `edit-tournament.html?id=${torneoId}`;
}


function manejarSolicitudes(torneoId){
    window.location.href = `manejarSolicitudesTorneo.html?id=${torneoId}`;
}

function borrarTorneo(torneoId) {
    const confirmarBorrar = confirm("¿Estás seguro de que deseas borrar este torneo?");
    if (confirmarBorrar) {
        fetch(`/api/tournaments/${torneoId}`, {
            method: 'DELETE'
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to delete tournament: ${response.status} ${response.statusText}`);
                }
                cargarTorneos();
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }
}

document.addEventListener("DOMContentLoaded", cargarTorneos);
