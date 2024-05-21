// Función para cargar los torneos del usuario
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
            listaEquipos.innerHTML = ""; // Limpiar la lista antes de cargar equipos

            teams.forEach(team => {
                const li = document.createElement("li");
                li.innerHTML = `
                    <div>
                        <a href="loadTeam.html?id=${team.id}"><h3>${team.name}</h3></a>
                        <p>Ubicación: ${team.location}</p>
                        <p>Privacidad: ${team.private ? "Privado" : "Público"}</p>
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

// Al cargar la página, cargar los torneos del usuario
document.addEventListener("DOMContentLoaded", loadTeams);
