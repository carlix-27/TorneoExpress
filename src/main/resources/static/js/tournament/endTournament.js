document.addEventListener('DOMContentLoaded', function() {
    const tournamentId = document.getElementById('tournamentId').value;

    document.getElementById('terminarTorneo').addEventListener('click', function() {
        if (!tournamentId) {
            alert('No se encontró el ID del torneo.');
            return;
        }

        // Confirmar finalización del torneo
        if (confirm('¿Estás seguro de que deseas terminar el torneo? Esta acción es irreversible.')) {
            // Enviar datos al servidor para finalizar el torneo
            fetch(`/api/tournaments/${tournamentId}/endTournament`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    tournamentId: tournamentId,
                })
            })
                .then(response => response.json())
                .then(data => {
                    if (!data.active) {
                        // Display success message in green
                        document.getElementById('success-message').innerText = "Torneo terminado con éxito";
                        document.getElementById('success-message').style.color = 'green';
                        document.getElementById('success-message').style.display = 'block';
                        document.getElementById('error-message').style.display = 'none';
                    } else {
                        document.getElementById('error-message').innerText = "Hubo un problema al terminar el torneo";
                        document.getElementById('error-message').style.color = 'red';
                        document.getElementById('error-message').style.display = 'block';
                        document.getElementById('success-message').style.display = 'none';
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    document.getElementById('error-message').innerText = "Error al terminar el torneo";
                    document.getElementById('error-message').style.color = 'red';
                    document.getElementById('error-message').style.display = 'block';
                    document.getElementById('success-message').style.display = 'none';
                });
        }
    });
});
