// Fetch active tournaments and display them with a join button
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

            // Clear existing list
            tournamentList.innerHTML = '';

            tournaments.forEach(tournament => {
                const tournamentName = tournament.name;
                const tournamentSport = tournament.sport;
                const tournamentSportName = tournamentSport.sportName;
                const tournamentLocation = tournament.location;
                const tournamentPrivacy = tournament.private;
                const maxTeams = tournament.maxTeams;
                const participatingTeams = tournament.participatingTeams;
                const numOfParticipatingTeams = participatingTeams.length;

                const listItem = document.createElement('li');
                listItem.innerHTML = `
                    <h3>${tournamentName}</h3>
                    <p>Deporte: ${tournamentSportName}</p>
                    <p>Ubicación: ${tournamentLocation}</p>
                    <p>Privacidad: ${tournamentPrivacy ? "Privado" : "Público"}</p>
                    <p>Dificultad: ${tournament.difficulty}</p>
                    <p>Equipos Participantes: ${numOfParticipatingTeams} / ${maxTeams}</p>
                    <button onclick="openModal('${tournamentName}', ${tournament.id})">Inscribirse</button>
                `;

                tournamentList.appendChild(listItem);
            });
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('error-message').innerText = 'Error al obtener los torneos activos.';
            document.getElementById('error-message').style.display = 'block';
        });
}

// Open modal and populate it with user's teams
function openModal(tournamentName, tournamentId) {
    const modal = document.getElementById('teamSelectionModal');
    const modalTournamentName = document.getElementById('modal-tournament-name');
    const teamSelect = document.getElementById('team-select');
    const joinButton = document.getElementById('join-tournament-button');

    // Set tournament name and id
    modalTournamentName.innerText = `Torneo: ${tournamentName}`;
    joinButton.setAttribute('data-tournament-id', tournamentId);

    // Fetch user's teams and populate select options
    const userId = localStorage.getItem("userId");
    if (!userId) {
        console.error("User ID not found in localStorage");
        return;
    }

    fetch(`/api/teams/user/${userId}`)
        .then(response => response.json())
        .then(teams => {
            teamSelect.innerHTML = '';
            teams.forEach(team => {
                const option = document.createElement('option');
                option.value = team.id;
                option.text = team.name;
                teamSelect.appendChild(option);
            });
        });

    modal.style.display = 'block';
}

// Close the modal
function closeModal() {
    document.getElementById('teamSelectionModal').style.display = 'none';
}

// Handle joining a tournament
document.getElementById('join-tournament-button').addEventListener('click', () => {
    const tournamentId = document.getElementById('join-tournament-button').getAttribute('data-tournament-id');
    const teamId = document.getElementById('team-select').value;
    const userId = localStorage.getItem("userId");

    fetch(`/api/tournaments/${tournamentId}/join`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            teamId: teamId,
            userId: userId
        })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to join tournament: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            closeModal();
            alert('Inscripción exitosa');
            fetchActiveTournaments();
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error al inscribirse en el torneo.');
        });
});

document.addEventListener("DOMContentLoaded", function() {
    fetchActiveTournaments();
});
