document.addEventListener('DOMContentLoaded', function() {
    const tournamentId = document.getElementById('tournamentId').value;

    document.getElementById('terminarTorneo').addEventListener('click', function() {
        if (!tournamentId) {
            alert('No se encontró el ID del torneo.');
            return;
        }

        // Confirmar finalización del torneo
        if (confirm('¿Estás seguro de que deseas terminar el torneo? Esta acción es irreversible.')) {
            // Obtener datos del puntaje
            const equiposPuntaje = obtenerPuntajesDeTabla();

            // Enviar datos al servidor para finalizar el torneo
            fetch('api/finishTournament', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    tournamentId: tournamentId,
                    equiposPuntaje: equiposPuntaje
                })
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        alert('El torneo ha terminado exitosamente.');
                        window.location.href = `verEstadisticas.html?id=${tournamentId}`;
                    } else {
                        alert('Hubo un error al terminar el torneo. Por favor, intenta de nuevo.');
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('Hubo un error al terminar el torneo. Por favor, intenta de nuevo.');
                });
        }
    });

    function obtenerPuntajesDeTabla() {
        const filas = document.querySelectorAll('#tablaContenido tr');
        const equiposPuntaje = [];
        filas.forEach(fila => {
            const columnas = fila.querySelectorAll('td');
            const nombreEquipo = columnas[0].innerText;
            const puntaje = parseInt(columnas[1].innerText);
            equiposPuntaje.push({ nombreEquipo, puntaje });
        });
        return equiposPuntaje;
    }
});
