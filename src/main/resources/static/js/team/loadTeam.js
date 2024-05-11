// Función para cargar los torneos del usuario
function loadTeam() {

    fetch(`/api/teams/${URL}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch teams: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(teams => {
            const teamList = document.getElementById("team");
            teamList.innerHTML = ""; // Limpiar la lista antes de cargar equipos

            teams.forEach(team => {
                const li = document.createElement("li");
                li.innerHTML = `
                    <div>
                        <h3>${team.name}</h3>
                        <p>Ubicación: ${team.location}</p>
                        <p>Privacidad: ${team.private ? "Privado" : "Público"}</p>
                    </div>
                `;
                teamList.appendChild(li);
            });
        })
        .catch(error => {
            console.error('Error:', error);
            // Handle error, show message to user
        });
}

// Al cargar la página, cargar los torneos del usuario
document.addEventListener("DOMContentLoaded", loadTeam);
