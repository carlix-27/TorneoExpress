function loadTeams() {
    const userId = localStorage.getItem("userId");
    if (!userId) {
        // Handle error, redirect to log in or show message
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
            listaEquipos.innerHTML = ""; // Limpiar la lista antes de cargar equipos

            teams.forEach(team => {
                const li = document.createElement("li");
                li.innerHTML = `
                    <div>
                        <h3>${team.name}</h3>
                        <p>Ubicación: ${team.location}</p>
                        <p>Privacidad: ${team.private ? "Privado" : "Público"}</p>
                        <button onclick="editarEquipo(${team.id})">Editar</button>
                        <button onclick="borrarEquipo(${team.id})">Borrar</button>
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
