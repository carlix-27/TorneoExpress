document.addEventListener('DOMContentLoaded', function() {
    // Obtener el ID del torneo de la URL y almacenarlo en el elemento oculto
    const urlParams = new URLSearchParams(window.location.search);
    const tournamentId = urlParams.get('id');
    if (tournamentId) {
        document.getElementById('tournamentId').value = tournamentId;
    }

    // Obtener el formulario y agregar el manejador de eventos
    const formularioEstadisticas = document.getElementById('formularioEstadisticas');
    if (formularioEstadisticas) {
        formularioEstadisticas.addEventListener('submit', saveStats);
    } else {
        console.error('No se encontró el formulario con el ID formularioEstadisticas');
    }
});

async function saveStats(event) {
    event.preventDefault();

    // Obtener el ID del torneo del elemento oculto en la página
    const tournamentId = document.getElementById('tournamentId').value;
    console.log(`Esto es lo que estoy obteniendo del elemento oculto ${tournamentId}`);
    if (!tournamentId) {
        alert('No tournament ID found.');
        return;
    }

    const matchId = document.querySelector('#partidoSelector').value;

    const team1Score = document.querySelector('input[name="team1Score"]').value;
    const team2Score = document.querySelector('input[name="team2Score"]').value;

    const ganador = document.querySelector('input[name="ganador"]').value;

    // Validar que los puntajes sean números válidos
    if (!isValidScore(team1Score) || !isValidScore(team2Score)) {
        document.getElementById('error-message').innerText = "Ingrese puntajes validos para los equipos";
        document.getElementById('error-message').style.color = 'red';
        document.getElementById('error-message').style.display = 'block';
        document.getElementById('success-message').style.display = 'none';
    }

    const data = {
        team1Score: parseInt(team1Score),
        team2Score: parseInt(team2Score),
        ganador: ganador
    };

    try {
        const response = await fetch(`/api/matches/${tournamentId}/${matchId}/statistics`, {
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


// Función auxiliar para validar puntajes válidos (números enteros)
function isValidScore(score) {
    return !isNaN(parseInt(score)) && isFinite(score) && parseInt(score) >= 0;
}