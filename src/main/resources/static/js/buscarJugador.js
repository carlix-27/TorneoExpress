// Función para cargar usuarios
function searchPlayer() {
    const userId = localStorage.getItem("userId");
    if (!userId) {
        // Handle error, redirect to log in or show message
        console.error("User ID not found in localStorage");
        return;
    }
    const name = document.getElementById("player-name");

    fetch(`/api/user/players/findByName/${name}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to find player: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(players => {
            const listaJugadores = document.getElementById("resultados-busqueda");
            listaJugadores.innerHTML = "" +
                "<section id='results'>" +
                "<h2>Jugadores hallados</h2>" +
                "</section>"; // Limpiar la lista antes de cargar equipos

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
        })
        .catch(error => {
            console.error('Error:', error);
            // Handle error, show message to user
        });
}

// Al cargar la página, cargar los torneos del usuario
document.addEventListener("DOMContentLoaded", searchPlayer);
