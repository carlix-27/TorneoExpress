document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const tournamentId = urlParams.get('id');

    fetchStatisticsAndMatches(tournamentId)
        .then(data => {
            const { statistics, matches } = data;
            populateMatches(statistics, matches);
            checkTournamentOwner(tournamentId);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
});

function fetchStatisticsAndMatches(tournamentId) {
    const fetchStatisticsPromise = fetch(`/api/tournaments/${tournamentId}/statistics`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        });

    const fetchMatchesPromise = fetch(`/api/tournaments/${tournamentId}/matches`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        });

    return Promise.all([fetchStatisticsPromise, fetchMatchesPromise])
        .then(([statistics, matches]) => {
            return { statistics, matches };
        });
}

function populateMatches(statistics, matches) {
    const listaPartidosTerminados = document.getElementById('listaPartidosTerminados');
    const listaPartidosPendientes = document.getElementById('listaPartidosPendientes');

    matches.forEach(match => {
        if (match.played) {
            const statistic = statistics.find(stat => stat.match.matchId === match.matchId);
            if (statistic) {
                const listItem = document.createElement('li');
                listItem.textContent = `${match.team1.name} ${statistic.team1Score} - ${statistic.team2Score} ${match.team2.name}`;
                listaPartidosTerminados.appendChild(listItem);
            }
        } else {
            const listItem = document.createElement('li');
            listItem.textContent = `${match.team1.name} vs ${match.team2.name}`;
            listaPartidosPendientes.appendChild(listItem);
        }
    });
}

function checkTournamentOwner(tournamentId) {
    const userId = getUserId();

    fetch(`/api/tournaments/${tournamentId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(tournament => {
            if (userId === tournament.creatorId) {
                const addButton = document.createElement('button');
                addButton.textContent = 'Agregar Estadísticas';
                addButton.addEventListener('click', () => {
                    window.location.href = 'agregarEstadisticas.html?id=' + tournamentId;
                });

                const header = document.querySelector('header');
                header.appendChild(addButton);
            }
        })
        .catch(error => {
            console.error('Error fetching tournament details:', error);
        });
}

function getUserId() {
    return localStorage.getItem("userId");
}
