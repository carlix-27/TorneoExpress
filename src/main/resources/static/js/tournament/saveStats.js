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
    console.log(matchId);
    const resultadoPartido = document.querySelector('input[name="resultadoPartido"]').value;
    const ganador = document.querySelector('input[name="ganador"]').value;


    const data = {
        resultadoPartido: resultadoPartido,
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
