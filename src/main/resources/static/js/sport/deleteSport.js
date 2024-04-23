function deleteSport(){
    const id = document.getElementById('id').value;

    const deleteSportRequest= {
        id: id,
    };

    const xhr = new XMLHttpRequest();
    xhr.open('DELETE', '/api/sports/delete/${id}', true);
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.onload = function () {
        if (xhr.status === 200) {
            alert('Deporte eliminado exitosamente');
            document.getElementById('remove-sport-form').reset();
        } else {
            alert('Ocurrió un error al eliminar el deporte. Por favor, inténtalo de nuevo.');
        }
    };

    xhr.send(JSON.stringify(deleteSportRequest));
}