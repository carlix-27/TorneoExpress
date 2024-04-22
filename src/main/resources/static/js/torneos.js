// Función para obtener y mostrar todos los torneos activos
function fetchActiveTournaments() {
    fetch('/api/tournaments/active')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch active tournaments: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(tournaments => {
            const tournamentList = document.getElementById('tournament-list');

            // Limpiar lista existente
            tournamentList.innerHTML = '';

            tournaments.forEach(tournament => {
                const listItem = document.createElement('li');
                listItem.innerHTML = `
                    <h3>${tournament.name}</h3>
                    <p>Deporte: ${tournament.sport.sportName}</p>
                    <p>${tournament.isPrivate ? 'Privado' : 'Público'}</p>
                `;
                tournamentList.appendChild(listItem);
            });
        })
        .catch(error => {
            console.error('Error:', error);
            // Manejar el error, mostrar mensaje al usuario
        });
}

// Punto de entrada cuando se carga la página
document.addEventListener("DOMContentLoaded", function() {
    fetchActiveTournaments();
});
