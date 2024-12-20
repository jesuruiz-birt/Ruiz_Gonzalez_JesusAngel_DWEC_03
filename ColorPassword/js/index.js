document.addEventListener('DOMContentLoaded', function () {
    // Cargar usuarios en el LocalStorage
    fetch('assets/data/usuarios.json')
        .then(response => response.json())
        .then(data => {
            localStorage.setItem('usuarios', JSON.stringify(data));
            console.log(localStorage);
        });

    // Validar formulario de login
    const loginForm = document.getElementById('loginForm');
    loginForm.addEventListener('submit', function (e) {
        e.preventDefault();
        
        const usuario = document.getElementById('usuario').value;
        const contrasena = document.getElementById('contrasena').value;
        const mensaje = document.getElementById('mensaje');
        
        // Validar formato de la contraseña
        const regex = /^[0-9]{4}[A-Z]{1}[a-z]{3}$/;
        if (!regex.test(contrasena)) {
            mensaje.textContent = 'La contraseña debe ser alfanumérica.';
            return;
        }

        // Validar usuario y contraseña
        const usuarios = JSON.parse(localStorage.getItem('usuarios'));
        const usuarioValido = usuarios.find(u => u.usuario === usuario && u.contraseña === contrasena);

        if (usuarioValido) {
            document.cookie = "logueado=true; path=/"; 
            console.log('Cookie establecida:', document.cookie);
            console.log('Redirigiendo a la página privada...');

            window.location.href = 'views/bienvenida.html'; 
        } else {
            mensaje.textContent = 'Usuario o contraseña incorrectos.';
        }

    });
    
});
