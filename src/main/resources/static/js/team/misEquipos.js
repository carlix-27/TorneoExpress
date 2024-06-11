function loadTeams() {
    const userId = localStorage.getItem("userId");
    if (!userId) {
        console.error("User ID not found in localStorage");
        return;
    }

    fetch(`/api/teams/user/${userId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch teams: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(teams => {
            const listaEquipos = document.getElementById("lista-equipos");
            listaEquipos.innerHTML = "";

            teams.forEach(team => {
                const teamId = team.id;
                const teamPrivate = team.private;
                const teamLocation = team.location;
                const teamName = team.name;
                const teamPlayers = team.players;
                const numberOfPlayersInTeam = teamPlayers.length;
                const teamSport = team.sport;
                const sportNumOfPlayers = teamSport.num_players;
                const maxNumberOfPlayersPerTeam = sportNumOfPlayers * 2;

                const li = document.createElement("li");
                li.innerHTML = `
                    <div>
                        <a  href="visualizarJugadoresEquipo.html?id=${team.id}"><h3>${teamName}</h3></a>
                        <p>Ubicación: ${teamLocation}</p>
                        <p>Privacidad: ${teamPrivate ? "Privado" : "Público"}</p>
                        <p>Jugadores inscritos: ${numberOfPlayersInTeam} / ${maxNumberOfPlayersPerTeam}</p>
                        <button onclick="editarEquipo(${teamId})">Editar</button>
                        <button onclick="borrarEquipo(${teamId})">Borrar</button>
                        ${teamPrivate ? `<button onclick="manejarSolicitudes(${teamId})">Manejar Solicitudes</button>` : ''}
                    </div>
                `;
                listaEquipos.appendChild(li);
            });
        })
        .catch(error => {
            console.error('Error:', error);
            // Handle error, show message to user
        });
}


function editarEquipo(teamId) {
    window.location.href = `editar-equipo.html?id=${teamId}`;
}

function manejarSolicitudes(torneoId){
    window.location.href = `manejarSolicitudesEquipo.html?id=${torneoId}`;
}

function borrarEquipo(teamId) {
    const confirmarBorrar = confirm("¿Estás seguro de que deseas borrar este equipo?");
    if (confirmarBorrar) {
        fetch(`/api/teams/${teamId}`, {
            method: 'DELETE'
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to delete team: ${response.status} ${response.statusText}`);
                }
                loadTeams();
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }
}

document.addEventListener("DOMContentLoaded", loadTeams);
