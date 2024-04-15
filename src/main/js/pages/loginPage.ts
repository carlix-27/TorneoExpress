
import { login } from '../front/login'; // Importa la función login desde tu archivo login.ts

// Obtén referencia al formulario
const loginForm = document.getElementById('login-form') as HTMLFormElement;

// Agrega un event listener al formulario para escuchar el evento de envío
loginForm.addEventListener('submit', async (event) => {
    event.preventDefault(); // Evita que el formulario se envíe de manera predeterminada

    // Obtiene los valores del formulario
    const formData = new FormData(loginForm);
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;

    try {
        // Llama a la función login con los valores del nombre de usuario y contraseña
        const result = await login(username, password);
        console.log('Inicio de sesión exitoso:', result);
        // Aquí puedes redirigir al usuario a otra página o mostrar un mensaje de éxito
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        // Aquí puedes mostrar un mensaje de error al usuario
    }
});
