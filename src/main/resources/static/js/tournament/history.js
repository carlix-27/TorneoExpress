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

            if (tournaments.length === 0) {
                const noTournamentsMessage = document.createElement("p");
                noTournamentsMessage.innerText = "No hay torneos disponibles en el historial.";
                listaTorneos.appendChild(noTournamentsMessage);
            } else {
                tournaments.forEach(tournament => {
                    const li = document.createElement("li");

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
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function verParticipantes(torneoId) {
    window.location.href = `participantes.html?id=${torneoId}`;
}

document.addEventListener("DOMContentLoaded", cargarHistorialTorneos);
