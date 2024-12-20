
// Función para verificar la sesión
function verificarSesion() {
    const cookies = document.cookie.split(';');
    const logueado = cookies.some(cookie => cookie.trim().startsWith('logueado='));
    if (!logueado) {
        console.log('No se encontró la cookie de sesión. Redirigiendo a la página de inicio de sesión.');
        window.location.href = '../index.html'; 
    }
}

// Si estamos en la página privada, verificar la sesión al cargar la página
if (window.location.pathname.endsWith('juego.html')) {
    verificarSesion();
}

// Función para seleccionar el nivel y redirigir a juego.html
function seleccionarNivel(nivel, intentos) {
    localStorage.setItem('nivel', nivel);
    localStorage.setItem('intentos', intentos);
    window.location.href = 'juego.html';
}

// Función para cargar los intentos en juego.html
function cargarIntentos() {
    const intentos = localStorage.getItem('intentos');
    console.log(`Intentos cargados: ${intentos}`);
    document.getElementById('intentos-restantes').textContent = `Intentos restantes: ${intentos}`;
}

let timer;
let tiempoRestante = 100;
let timerStarted = false;
let intentosTotales;
let intentosRestantes;

const coloresDisponibles = ['red', 'blue', 'green', 'yellow', 'purple'];

window.onload = function() {
    if (window.location.pathname.endsWith('juego.html')) {
        cargarIntentos();
        intentosTotales = parseInt(localStorage.getItem('intentos'));
        intentosRestantes = parseInt(localStorage.getItem('intentos'));
        console.log(`Intentos restantes al cargar la página: ${intentosRestantes}`);

        document.querySelectorAll('.arrastrar .cuadro').forEach(cuadro => {
            cuadro.addEventListener('dragstart', drag);
        });

        iniciarTemporizador();
    }
}

let secuenciaSecreta = [];
let intentoActual = 0;

function generarSecuenciaSecreta(longitud) {
    secuenciaSecreta = [];
    for (let i = 0; i < longitud; i++) {
        const indiceAleatorio = Math.floor(Math.random() * coloresDisponibles.length);
        secuenciaSecreta.push(coloresDisponibles[indiceAleatorio]);
    }
    console.log("Secuencia secreta:", secuenciaSecreta);
}

// Función para iniciar el temporizador
function iniciarTemporizador() {
    if (!timerStarted) {
        timerStarted = true;
        timer = setInterval(() => {
            tiempoRestante--;
            document.getElementById('timer').textContent = tiempoRestante;
            if (tiempoRestante <= 0) {
                clearInterval(timer);
                alert('¡Tiempo agotado!');
                window.location.href = '../index.html';
            }
        }, 1000);
    }
}

function crearIntento() {
    const contenedorPrincipal = document.getElementById('contenedor-principal');
    const intento = document.createElement('section');
    intento.className = 'intento';
    intento.id = `intento-${intentoActual}`;

    const intentoCuadros = document.createElement('section');
    intentoCuadros.className = 'intento_cuadros';

    for (let i = 0; i < secuenciaSecreta.length; i++) {
        const cuadroGris = document.createElement('article');
        cuadroGris.className = 'cuadro gris';
        cuadroGris.ondrop = drop;
        cuadroGris.ondragover = allowDrop;
        intentoCuadros.appendChild(cuadroGris);
    }

    const botonComprobar = document.createElement('button');
    botonComprobar.type = 'button';
    botonComprobar.textContent = 'Comprobar';
    botonComprobar.onclick = comprobar;

    const pista = document.createElement('p');
    pista.id = `pista${intentoActual + 1}`;
    pista.className = 'pista';
    pista.textContent = `Intento ${intentoActual + 1}: Aciertos color y posición: 0; Colores acertados: 0.`;

    intento.appendChild(intentoCuadros);
    intento.appendChild(botonComprobar);
    intento.appendChild(pista);
    contenedorPrincipal.appendChild(intento);
}

function allowDrop(ev) {
    ev.preventDefault();
}

function drop(ev) {
    ev.preventDefault();
    const data = ev.dataTransfer.getData("text");
    ev.target.style.backgroundColor = data;
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.className);
}

function comprobar() {
    const cuadrosGris = document.querySelectorAll(`#intento-${intentoActual} .intento_cuadros .cuadro`);
    let coloresCorrectosPosicion = 0;
    let coloresCorrectos = 0;

    const coloresUsuario = Array.from(cuadrosGris).map(cuadro => cuadro.style.backgroundColor);
    console.log(`Intento ${intentoActual + 1}, Colores del usuario:`, coloresUsuario);

    for (let i = 0; i < secuenciaSecreta.length; i++) {
        if (coloresUsuario[i] === secuenciaSecreta[i]) {
            coloresCorrectosPosicion++;
        } else if (secuenciaSecreta.includes(coloresUsuario[i])) {
            coloresCorrectos++;
        }
    }
    console.log(`Intento ${intentoActual + 1}, Aciertos color y posición: ${coloresCorrectosPosicion}, Colores acertados: ${coloresCorrectos}`);

    const pista = document.getElementById(`pista${intentoActual + 1}`);
    pista.textContent = `Intento ${intentoActual + 1}: Aciertos color y posición: ${coloresCorrectosPosicion}; Colores acertados: ${coloresCorrectos}.`;

    if (coloresCorrectosPosicion === secuenciaSecreta.length) {
        alert("¡Has ganado!");
        finalizarJuego('ganado');
        return;
    }
    
    intentosRestantes--;
    console.log(`Intentos restantes después de comprobar: ${intentosRestantes}`);
    if (intentosRestantes >= 0) {
        document.getElementById('intentos-restantes').textContent = `Intentos restantes: ${intentosRestantes}`;
    } else {
        finalizarJuego('perdido');
    }

    intentoActual++;
    if (intentoActual < intentosTotales) {
        const intentoAnterior = document.getElementById(`intento-${intentoActual - 1}`);
        intentoAnterior.classList.add('desactivado');
        crearIntento();
    } else {
        alert("¡Has perdido! La secuencia era: " + secuenciaSecreta.join(", "));
        const intentoAnterior = document.getElementById(`intento-${intentoActual - 1}`);
        intentoAnterior.classList.add('desactivado');
        finalizarJuego('perdido');
        return;
    }
}

// Función para finalizar el juego
function finalizarJuego(resultado) {
    clearInterval(timer);
    console.log(`Juego finalizado con resultado: ${resultado}, Intentos restantes: ${intentosRestantes}, Tiempo restante: ${tiempoRestante}`);
    localStorage.setItem('resultado', resultado);
    localStorage.setItem('tiempoRestante', tiempoRestante);
    localStorage.setItem('intentosRestantes', intentosRestantes);
    window.location.href = 'resultados.html';
}

// Inicialización
generarSecuenciaSecreta(5);
crearIntento();

// Creación de los cuadros de colores arrastrables
const contenedorColores = document.getElementById('contenedor-colores'); 

coloresDisponibles.forEach(color => {
    const cuadro = document.createElement('article');
    cuadro.className = 'cuadro';
    cuadro.style.backgroundColor = color;
    cuadro.draggable = true;
    cuadro.addEventListener('dragstart', (event) => {
        event.dataTransfer.setData("text", event.target.style.backgroundColor);
        event.target.classList.add('dragging');
    });
    cuadro.addEventListener('dragend', (event) => {
        event.target.classList.remove('dragging');
    });
    contenedorColores.appendChild(cuadro);
});
