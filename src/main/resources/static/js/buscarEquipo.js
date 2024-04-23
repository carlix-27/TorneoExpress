// Función para cargar usuarios
function searchTeam(event) {
    event.preventDefault();

    const userId = localStorage.getItem("userId");
    if (!userId) {
        // Handle error, redirect to log in or show message
        console.error("User ID not found in localStorage");
        return;
    }
    const name = document.getElementById("team-name").value;

    fetch(`/api/teams/findByName/${encodeURIComponent(name)}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to find team: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(teams => {
            const section = document.getElementById("results");
            section.innerHTML = "<h2>Equipos hallados</h2>" +
                "<ul id=\"lista-equipos\">\n" +
                "            <!-- Los torneos se cargarán dinámicamente aquí -->\n" +
                "        </ul>";
            const listaEquipos = document.getElementById("lista-equipos");

            if (teams.length === 0) {
                listaEquipos.innerHTML = "<p>No se hallaron equipos con ese nombre</p>"
            } else {
                teams.forEach(team => {
                    const li = document.createElement("li");
                    li.innerHTML = `
                    <div>
                        <h3>${team.name}</h3>
                        <p>Ubicación: ${team.location}</p>
                        <p>Privacidad: ${team.privacy ? "Privado" : "Público"}</p>
                        <p>Puntos de Prestigio: ${team.prestigePoints}</p>
                    </div>
                `;
                    listaEquipos.appendChild(li);
                });
            }
        })
        .catch(error => {
            console.error('Error:', error);
            // Handle error, show message to user
        });
}

// Al cargar la página, cargar los torneos del usuario
//document.addEventListener("DOMContentLoaded", searchPlayer);

document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("find-team-form");
    form.addEventListener('submit', searchTeam);
});

