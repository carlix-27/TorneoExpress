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
                    <a href="loadTournament.html?id=${tournament.id}"><h3>${tournament.name}</h3></a> 
                    <p>Deporte: ${tournament.sport.sportName}</p>
                    <p>${tournament.private ? 'Privado' : 'Público'}</p>
                `;

                // Creación del botón de inscripción
                const enrollButton = document.createElement('button');
                enrollButton.textContent = 'Inscribirse';
                enrollButton.addEventListener('click', () => {
                    enrollInTournament(tournament.id, tournament.private);
                });

                // Botón a la lista
                listItem.appendChild(enrollButton);

                tournamentList.appendChild(listItem);
            });
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('error-message').innerText = 'Error al obtener los torneos activos.';
            document.getElementById('error-message').style.display = 'block';
        });
}

// .......................

// Función para inscribirse en un torneo

function enrollInTournament(tournamentId, isPrivate) { // Fijate que esté en private
    const userId = localStorage.getItem("userId");
    const teamId = localStorage.getItem("teamId");

    // Verificar si el usuario está en un equipo
    checkIfUserIsCaptain(userId, function (isCaptain){
        if(!isCaptain){
            document.getElementById('error-message').innerText = "Debes ser capitán para poder unirte a un torneo.";
            document.getElementById('error-message').style.color = 'red';
            document.getElementById('error-message').style.display = 'block';
            document.getElementById('success-message').style.display = 'none';
        }
    });

    // Si el torneo es privado, mostrar un formulario de solicitud de acceso
    if (isPrivate) {
        const confirmation = confirm("Este torneo es privado. ¿Deseas enviar una solicitud de acceso?");
        if (confirmation) {
            sendAccessRequest(tournamentId, userId, teamId);
        }

    } else {
        enrollUserInPublicTournament(tournamentId); // Si el torneo es público, el usuario puede inscribirse directamente
    }
}


// .......................

// Función para enviar una solicitud de acceso

function sendAccessRequest(tournamentId, userId, teamId) {
    const requestPayload = {
        userId: userId,
        teamId: teamId
    };

    fetch(`/api/tournaments/${tournamentId}/access-request`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestPayload)
    })
        .then(response => {
            if (response.ok) {
                console.log("Solicitud enviada exitosamente.");
                document.getElementById('success-message').innerText = "Solicitud enviada exitosamente.";
                document.getElementById('success-message').style.color = 'green';
                document.getElementById('success-message').style.display = 'block';
                document.getElementById('error-message').style.display = 'none';
            } else {
                throw new Error(`Error al enviar la solicitud: ${response.status} ${response.statusText}`);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('error-message').innerText = "Error al enviar la solicitud.";
            document.getElementById('error-message').style.color = 'red';
            document.getElementById('error-message').style.display = 'block';
            document.getElementById('success-message').style.display = 'none';
        });
}

// .......................

// Función para inscribir al usuario en un torneo público

function enrollUserInPublicTournament(tournamentId) {
    const userId = localStorage.getItem("userId");
    const data = {
        userId: userId,
        tournamentId: tournamentId
    }

    // Realizar una solicitud AJAX al backend para inscribir al usuario en el torneo público
    fetch(`/api/tournaments/${tournamentId}/enroll`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to enroll user in public tournament: ${response.status} ${response.statusText}`);
            }
            document.getElementById('success-message').innerText = "Te has inscripto exitosamente en el torneo!";
            document.getElementById('success-message').style.color = 'green';
            document.getElementById('success-message').style.display = 'block';
            document.getElementById('error-message').style.display = 'none';
            fetchActiveTournaments(); // Aquí podrías realizar otras acciones, como recargar la lista de torneos activos
        })
        .catch(error => {
            console.error('Error: ', error);
            document.getElementById('error-message').innerText = "Hubo un error al inscribirse en el torneo. Por favor, intenta nuevamente más tarde.";
            document.getElementById('error-message').style.color = 'red';
            document.getElementById('error-message').style.display = 'block';
            document.getElementById('success-message').style.display = 'none';
        });
}

// .......................

// Chequea si el usuario está en un equipo

function checkIfUserIsCaptain(userId, callback) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `/api/user/${userId}/team-owner`, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function() {
        if (xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);
            const isCaptain = response.is_Captain;
            callback(isCaptain);
        } else {
            console.error(xhr.responseText);
            callback(false); // Default to not in team if there's an error
        }
    };
    xhr.send();
}

// .......................

// Punto de entrada cuando se carga la página

document.addEventListener("DOMContentLoaded", function() {
    fetchActiveTournaments();
});
