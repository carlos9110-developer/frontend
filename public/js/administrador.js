function inicio() {
    if (Funciones.verificarToken() == false) {
        setInterval(function() { window.location.href = "index"; }, 3000);
        alertify.notify('Error, Error no tiene permisos para utilizar la plataforma', 'error', 8);
    }
    Funciones.bienvenido();
}
inicio();