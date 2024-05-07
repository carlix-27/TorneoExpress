function searchTournament(event) {
    event.preventDefault();

    const userId = localStorage.getItem("userId");
    if (!userId) {
        console.error("User ID not found in localStorage");
        return;
    }

    const name = document.getElementById("tournament-name").value;
    const type = document.getElementById("tournament-type").value;
    const sport = document.getElementById("tournament-sport").value;

    let url = `/api/tournaments/findByName/${encodeURIComponent(name)}`;
    if (type !== 'all') {
        url += `?type=${type}`;
    }
    if (sport) {
        url += (type === 'all' ? '?' : '&') + `sport=${encodeURIComponent(sport)}`;
    }

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to find tournaments: ${response.status} ${response.statusText}`);
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
                        <p>Deporte: ${tournament.sport}</p>
                        <p>Dificultad: ${tournament.difficulty}</p>
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

document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("find-tournament-form");
    form.addEventListener('submit', searchTournament);
});
