// Función para cargar usuarios
function searchPlayer(event) {
    event.preventDefault();

    const userId = localStorage.getItem("userId");
    if (!userId) {
        // Handle error, redirect to log in or show message
        console.error("User ID not found in localStorage");
        return;
    }
    const name = document.getElementById("player-name").value;

    fetch(`/api/user/players/findByName/${encodeURIComponent(name)}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to find player: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(players => {
            const section = document.getElementById("results");
            section.innerHTML = "<h2>Jugadores hallados</h2>" +
                "<ul id=\"lista-jugadores\">\n" +
                "            <!-- Los torneos se cargarán dinámicamente aquí -->\n" +
                "        </ul>";
            const listaJugadores = document.getElementById("lista-jugadores");

            if (players.length === 0) {
                listaJugadores.innerHTML = "<p>No se hallaron jugadores con ese nombre</p>"
            } else {
                players.forEach(player => {
                    const li = document.createElement("li");
                    li.innerHTML = `
                    <div>
                        <h3>${player.name}</h3>
                        <p>Ubicación: ${player.location}</p>
                    </div>
                `;
                    listaJugadores.appendChild(li);
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
    const form = document.getElementById("find-player-form");
    form.addEventListener('submit', searchPlayer);
});
