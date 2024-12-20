// Función para verificar la sesión
function verificarSesion() {
    const cookies = document.cookie.split(';');
    const logueado = cookies.some(cookie => cookie.trim().startsWith('logueado='));
    if (!logueado) {
        console.log('No se encontró la cookie de sesión. Redirigiendo a la página de inicio de sesión.');
        window.location.href = '../index.html'; // Redirige a la página de inicio de sesión si no está logueado
    }
}

// Si estamos en la página privada, verificar la sesión al cargar la página
if (window.location.pathname.endsWith('resultados.html')) {
    verificarSesion();
}

function reiniciarJuego() {
    limpiarLocalStorage();
    window.location.href = 'bienvenida.html';
}

function salirJuego() {
    limpiarLocalStorage();
    window.location.href = '../index.html';
}

function limpiarLocalStorage() {
    localStorage.removeItem('intentos');
    localStorage.removeItem('intentosRestantes');
    localStorage.removeItem('resultado');
    localStorage.removeItem('tiempoRestante');
}

document.addEventListener('DOMContentLoaded', function () {
    const resultado = localStorage.getItem('resultado');
    const intentosRestantes = localStorage.getItem('intentosRestantes');
    const tiempoRestante = localStorage.getItem('tiempoRestante');
    console.log(`Resultados cargados - Resultado: ${resultado}, Intentos restantes: ${intentosRestantes}, Tiempo restante: ${tiempoRestante}`);

    if (resultado === 'ganado') {
        document.getElementById('resultadoFinal').textContent = '¡Felicidades! Has ganado el juego.';
    } else if (resultado === 'perdido') {
        document.getElementById('resultadoFinal').textContent = 'Lo siento, has perdido el juego.';
    }

    document.getElementById('resultadoIntentos').textContent = ` Intentos restantes: ${intentosRestantes}.`;
    document.getElementById('tiempoEmpleado').textContent = ` Tiempo empleado: ${100 - tiempoRestante} segundos.`;
});

