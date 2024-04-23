function searchTournament(event) {
    event.preventDefault();

    const userId = localStorage.getItem("userId");
    if (!userId) {
        // Handle error, redirect to log in or show message
        console.error("User ID not found in localStorage");
        return;
    }
    const name = document.getElementById("tournament-name").value;

    fetch(`/api/tournaments/findByName/${encodeURIComponent(name)}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to find player: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(tournaments => {
            const section = document.getElementById("results");
            section.innerHTML = "<h2>Torneos hallados</h2>" +
                "<ul id=\"lista-torneos\">\n" +
                "            <!-- Los torneos se cargarán dinámicamente aquí -->\n" +
                "        </ul>";
            const listaTorneos = document.getElementById("lista-torneos");

            if (tournaments.length === 0) {
                listaTorneos.innerHTML = "<p>No se hallaron torneos con ese nombre</p>"
            } else {
                tournaments.forEach(tournament => {
                    const li = document.createElement("li");
                    li.innerHTML = `
                    <div>
                        <h3>${tournament.name}</h3>
                        <p>Ubicación: ${tournament.location}</p>
                        <p>Privacidad: ${tournament.privacy ? "Privado" : "Público"}</p>
                        <p>Difficulty: ${tournament.difficulty}</p>
                    </div>
                `;
                    listaTorneos.appendChild(li);
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
    const form = document.getElementById("find-tournament-form");
    form.addEventListener('submit', searchTournament);
});
