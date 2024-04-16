// login.ts

// Importa la biblioteca Axios para realizar solicitudes HTTP
import axios from 'axios';

// Define la función para enviar la solicitud de inicio de sesión
async function login(email: string, password: string) {
    try {
        // Realiza una solicitud POST al endpoint '/submit_login' con los datos de inicio de sesión
        const response = await axios.post('/submit_login', { player_email: email, password });
        // Devuelve los datos de la respuesta si la solicitud fue exitosa
        return response.data;
    } catch (error) {
        // Maneja cualquier error que pueda ocurrir durante la solicitud
        console.error('Error al iniciar sesión:', error);
        throw error;
    }
}

// Exporta la función de inicio de sesión para que pueda ser utilizada en otros archivos
export { login };
