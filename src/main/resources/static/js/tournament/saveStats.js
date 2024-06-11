// Este código está para poder guardar los cambios de los resultados y demás en la base de datos

// Función para cargar el ID del torneo almacenado en localStorage
function loadTournamentId() {
    return localStorage.getItem("tournamentId");
}

function loadUserId() {
    return localStorage.getItem("userId");
}

async function getTournamentsByUserId(userId) {
    try {
        const response = await fetch(`/api/tournaments/user/${userId}`);
        if (response.ok) {
            const tournaments = await response.json();
            return tournaments;
        } else {
            console.error('Error fetching tournaments');
            return null;
        }
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}

async function loadTournaments() {
    const userId = loadUserId();
    if (!userId) {
        alert('No user ID found.');
        return;
    }

    const tournaments = await getTournamentsByUserId(userId);
    if (tournaments && tournaments.length > 0) {
        const torneoSelect = document.getElementById('torneoSelect');
        tournaments.forEach((tournament, index) => {
            const option = document.createElement('option');
            option.value = tournament.id;
            option.text = tournament.name;
            torneoSelect.appendChild(option);
        });
    } else {
        alert('No tournaments found for user.');
    }
}

document.addEventListener('DOMContentLoaded', loadTournaments);

async function saveStats(event) {
    event.preventDefault();

    const torneoSelect = document.getElementById('torneoSelect');
    const tournamentId = torneoSelect.value;
    console.log(`Esto es lo que estoy obteniendo del select ${tournamentId}`);
    if (!tournamentId) {
        alert('No tournament ID found.');
        return;
    }

    const resultadoPartido = document.querySelector('input[name="resultadoPartido"]').value;
    const posesionBalon = document.querySelector('input[name="posesionBalon"]').value;
    const tirosAlArco = document.querySelector('input[name="tirosAlArco"]').value;
    const tirosAPuerta = document.querySelector('input[name="tirosAPuerta"]').value;
    const faltas = document.querySelector('input[name="faltas"]').value;

    const data = {
        resultadoPartido: resultadoPartido,
        posesionBalon: posesionBalon,
        tirosAlArco: tirosAlArco,
        tirosAPuerta: tirosAPuerta,
        faltas: faltas
    };

    try {
        const response = await fetch(`/api/tournaments/${tournamentId}/statistics`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            // Display success message in green
            document.getElementById('success-message').innerText = "Estadísticas agregadas con éxito";
            document.getElementById('success-message').style.color = 'green';
            document.getElementById('success-message').style.display = 'block';
            document.getElementById('error-message').style.display = 'none';
            document.getElementById('formularioEstadisticas').reset();
        } else {
            document.getElementById('error-message').innerText = "Hubo un problema al agregar las estadísticas";
            document.getElementById('error-message').style.color = 'red';
            document.getElementById('error-message').style.display = 'block';
            document.getElementById('success-message').style.display = 'none';
        }
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('error-message').innerText = "Error al guardar las estadísticas";
        document.getElementById('error-message').style.color = 'red';
        document.getElementById('error-message').style.display = 'block';
        document.getElementById('success-message').style.display = 'none';
    }
}

document.getElementById('formularioEstadisticas').addEventListener('submit', saveStats);
