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
            // Manejar el error, mostrar mensaje al usuario
        });
}

// Función para inscribirse en un torneo
function enrollInTournament(id, private) {
    const userId = localStorage.getItem("userId");

    // Verificar si el usuario está en un equipo
    checkIfUserIsCaptain(userId, function (isCaptain){
        if(!isCaptain){
            document.getElementById('error-message').innerText = "Debes ser capitán para poder unirte a un torneo.";
            return;
        }
    });

    // Si el torneo es privado, mostrar un formulario de solicitud de acceso
    if (private) {
        const confirmation = confirm("Este torneo es privado. ¿Deseas enviar una solicitud de acceso?");
        if (confirmation) {
            sendAccessRequest(id); // Aquí puedes implementar la lógica para enviar una solicitud de acceso
        }
    } else {
        enrollUserInPublicTournament(id); // Si el torneo es público, el usuario puede inscribirse directamente
    }
}

// Función para enviar una solicitud de acceso
function sendAccessRequest(id) {
    // Aquí puedes implementar la lógica para enviar una solicitud de acceso al administrador del torneo
    // Esto podría ser mediante un formulario de solicitud o una solicitud AJAX al backend
    // Una vez enviada la solicitud, podrías mostrar un mensaje de confirmación al usuario
}

// Función para inscribir al usuario en un torneo público
function enrollUserInPublicTournament(id) {
    const userId = localStorage.getItem("userId");
    const data = {
        userId: userId,
        tournamentId: id
    }

    // Realizar una solicitud AJAX al backend para inscribir al usuario en el torneo público
    fetch('/api/tournaments/' + id + '/enroll', {
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
            document.getElementById('error-message').innerText = "\"Hubo un error al inscribirse en el torneo. Por favor, intenta nuevamente más tarde.";
            document.getElementById('error-message').style.color = 'red';
            document.getElementById('error-message').style.display = 'block';
            document.getElementById('success-message').style.display = 'none';
        });
}

// Chequea si el usuario está en un equipo
function checkIfUserIsCaptain(userId, callback) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', '/api/user/' + userId + '/team-owner', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function() {
        if (xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);
            const isCaptain = response.ownerTeam;
            callback(isCaptain);
        } else {
            console.error(xhr.responseText);
            callback(false); // Default to not in team if there's an error
        }
    };
    xhr.send();
}

// Punto de entrada cuando se carga la página
document.addEventListener("DOMContentLoaded", function() {
    fetchActiveTournaments();
});
