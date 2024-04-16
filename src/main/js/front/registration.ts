// registration.ts

// Importa la biblioteca Axios para realizar solicitudes HTTP
import axios from 'axios';

// Define la función para enviar la solicitud de registro
async function register(name: string, location: string, email: string, password: string) {
    try {
        // Realiza una solicitud POST al endpoint '/submit_registration' con los datos de registro
        const response = await axios.post('/submit_registration', { player_name: name, player_location: location, player_email: email, password });
        // Devuelve los datos de la respuesta si la solicitud fue exitosa
        return response.data;
    } catch (error) {
        // Maneja cualquier error que pueda ocurrir durante la solicitud
        console.error('Error al registrar usuario:', error);
        throw error;
    }
}

// Exporta la función de registro para que pueda ser utilizada en otros archivos
export { register };
