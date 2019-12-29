var Funciones = function() {
    return {
        cerrarModalCargando: function() {
            setTimeout(function() {
                $("#cargando").modal("hide");
            }, 1000);
        },
        abrirModalCargando: function() {
            $("#cargando").modal("show");
        },
        bienvenido: function() {
            let usuario = JSON.parse(localStorage.getItem("usuario"));
            $("#texto-nombre-usuario").text(usuario.nombre + " " + usuario.apellidos);
        },
        verificarToken: function() {
            let usuario = JSON.parse(localStorage.getItem("usuario"));
            if (usuario != null) {
                $.ajax({
                    url: "http://127.0.0.1:8000/api/VerificarToken",
                    type: "GET",
                    dataType: 'json',
                    headers: { "Authorization": usuario.token },
                    beforeSend: function() {},

                    success: function(datos) {
                        return datos.success;
                    },
                    error: function() {}
                });
            } else {
                return false;
            }
        },
        expiracion: function() {
            alertify.notify('Error, La sesión ha expirado', 'error', 8);
            setInterval(function() { window.location.href = "index"; }, 3000);
        },
        nombreUrl: function() {
            return "http://127.0.0.1:8000/api/";
        }
    }
}();