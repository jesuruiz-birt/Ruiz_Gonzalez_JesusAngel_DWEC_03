// Verificar si el usuario está logueado al cargar la página privada 
function verificarSesion() {
    const cookies = document.cookie.split(';'); 
    const logueado = cookies.some(cookie => cookie.trim().startsWith('logueado=')); 
    if (!logueado) { 
        console.log('No se encontró la cookie de sesión. Redirigiendo a la página de inicio de sesión.');
        window.location.href = '../index.html'; 
    } 
}

// Si estamos en la página privada, verificar la sesión al cargar la página 
if (window.location.pathname.endsWith('bienvenida.html')) {
    verificarSesion(); 
}

function seleccionarNivel(nivel) {
    let intentos;
    switch (nivel) {
        case 'principiante':
            intentos = 12;
            break;
        case 'intermedio':
            intentos = 10;
            break;
        case 'avanzado':
            intentos = 8;
            break;
    }
    console.log(`Intentos: ${intentos}`);
    localStorage.setItem('intentos', intentos);
    window.location.href = 'juego.html';
}
