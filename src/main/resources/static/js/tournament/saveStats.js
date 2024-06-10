// Este código está para poder guardar los cambios de los resultados y demás en la base de datos

// Función para cargar el ID del torneo almacenado en localStorage
function loadTournamentId() {
    return localStorage.getItem("tournamentId");
}

async function saveStats(event) {
    event.preventDefault();

    const tournamentId = loadTournamentId();
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
            alert('Statistics saved successfully!');
        } else {
            alert('Error saving statistics.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error saving statistics.');
    }
}


document.getElementById('formularioEstadisticas').addEventListener('submit', saveStats);
