document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const loginButton = document.getElementById('loginButton');
    loginButton.disabled = true; // Deshabilitar botón de inicio de sesión

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    console.log(`Intentando login con usuario: ${username}`);

    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();

        if (response.ok) {
            console.log('Login exitoso');

            // Guardar username, userId y userIdFromEnv en localStorage
            localStorage.setItem('username', username);
            localStorage.setItem('userId', data.userId);
            localStorage.setItem('userIdFromEnv', data.userIdFromEnv);

            console.log('Datos guardados en localStorage:');
            console.log('username:', username);
            console.log('userId:', data.userId);
            console.log('userIdFromEnv:', data.userIdFromEnv);

            // Redirigir al usuario a la página principal
            window.location.href = './views/principal.html';
        } else {
            console.error('Error en el login:', data.message);
            alert(data.message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al iniciar sesión');
    } finally {
        loginButton.disabled = false; // Habilitar botón nuevamente
    }
});



// const username = localStorage.getItem('username');
// const userId = localStorage.getItem('userId');
// const userIdFromEnv = localStorage.getItem('userIdFromEnv');

// console.log('Usuario logueado:', username);
// console.log('ID del usuario:', userId);
// console.log('ID del usuario desde env:', userIdFromEnv);






// console.log('username:', localStorage.getItem('username'));
// console.log('userId:', localStorage.getItem('userId'));
// console.log('userIdFromEnv:', localStorage.getItem('userIdFromEnv'));
