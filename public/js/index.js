function inicio() {
    $("#form-login").on("submit", function(e) {
        login(e);
    });
    localStorage.clear();
    $("#form-login")[0].reset();
}
inicio();

function login(e) {
    e.preventDefault(); //No se activará la acción predeterminada del evento
    let usuario = $("#email").val();
    let clave = $("#clave").val();
    let objeto = { "usuario": usuario, "password": clave };
    $.ajax({
        url: Funciones.nombreUrl() + "login",
        type: "POST",
        data: objeto,
        dataType: 'json',
        beforeSend: function() {
            Funciones.abrirModalCargando();
        },
        success: function(datos) {
            if (datos.success == true) {
                if (typeof(Storage) !== "undefined") {
                    localStorage.setItem("usuario", JSON.stringify(datos));
                    let usuario = JSON.parse(localStorage.getItem("usuario"));
                    if (usuario.rol == 1) {
                        window.location.href = "administrador";
                    } else {
                        window.location.href = "cajero.html";
                    }
                }
            } else {
                alertify.notify('Usuario o contraseña incorrectos', 'error', 8);
            }
            Funciones.cerrarModalCargando();
        },
        error: function() {
            alertify.notify('Error, se presento un problema en el servidor por favor intentelo de nuevo', 'error', 8);
            Funciones.cerrarModalCargando();
        }
    });
}