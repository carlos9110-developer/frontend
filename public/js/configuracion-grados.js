var totalGrados = 0;
var arrayMaterias = [];
var gradoSeleccionado = 0;
var nombreGradoSeleccionado = "";
var totalMaterias = 0;
var arrayPeriodos = [];
var arrayFechasInicio = [];
var arrayFechasFinal = [];
var arrayPorcentajes = [];
var usuario;

function inicio() {
    Funciones.abrirModalCargando();
    if (Funciones.verificarToken() == false) {
        Funciones.cerrarModalCargando();
        alertify.notify('Error, No tiene permisos para utilizar la plataforma', 'error', 8);
        setInterval(function() { window.location.href = "index"; }, 3000);
    } else {
        usuario = JSON.parse(localStorage.getItem("usuario"));
        Funciones.bienvenido();
        traerGradosColegio();
        Funciones.cerrarModalCargando();
        traerMateriasColegio(1);
        prevent_submit_form();
        traerAreas();
    }
}
inicio();

// función donde se previene el submit del formulario
function prevent_submit_form() {
    $("#formRegistroMaterias").on("submit", function(e) {
        guardarMateria(e);
    });
}

function cambioFecha1(guia, fecha) {

    let fecha_inicio = new Date(fecha);
    var dias = 2;
    fecha_inicio.setDate(fecha_inicio.getDate() + dias);

    let day = fecha_inicio.getDate();
    if (day < 10) {
        day = "0" + day;
    }
    let month = fecha_inicio.getMonth() + 1;
    if (month < 10) {
        month = "0" + month;
    }
    let year = fecha_inicio.getFullYear();
    let fechaNueva = year + "-" + month + "-" + day;


    if (fecha != "") {
        $("#inputFechaFinal" + guia).attr("min", fechaNueva);
        $("#inputFechaFinal" + guia).prop("disabled", false);
    } else {
        $("#inputFechaFinal" + guia).removeAttr("min");
        $("#inputFechaFinal" + guia).prop("disabled", true);
        $("#inputFechaFinal" + guia).val("");
    }
}

function cambioFecha2(guia, fecha) {
    let valorGuia = guia + 1;
    let fecha_inicio = new Date(fecha);
    var dias = 2;
    fecha_inicio.setDate(fecha_inicio.getDate() + dias);
    let day = fecha_inicio.getDate();
    if (day < 10) {
        day = "0" + day;
    }
    let month = fecha_inicio.getMonth() + 1;
    if (month < 10) {
        month = "0" + month;
    }
    let year = fecha_inicio.getFullYear();
    let fechaNueva = year + "-" + month + "-" + day;
    if (fecha != "") {
        $("#inputFechaInicio" + valorGuia).val(fechaNueva);
        $("#inputFechaInicio" + valorGuia).attr("min", fechaNueva);
        $("#inputFechaInicio" + valorGuia).prop("disabled", false);
        fecha_inicio.setDate(fecha_inicio.getDate() + 1);
        day = fecha_inicio.getDate();
        if (day < 10) {
            day = "0" + day;
        }
        month = fecha_inicio.getMonth() + 1;
        if (month < 10) {
            month = "0" + month;
        }
        year = fecha_inicio.getFullYear();
        fechaNueva = year + "-" + month + "-" + day;
        $("#inputFechaFinal" + valorGuia).val(fechaNueva);
        $("#inputFechaFinal" + valorGuia).attr("min", fechaNueva);
        $("#inputFechaFinal" + valorGuia).prop("disabled", false);
    } else {
        $("#inputFechaInicio" + valorGuia).removeAttr("min");
        $("#inputFechaInicio" + valorGuia).prop("disabled", true);
    }
}

// función donde se traen las areas de la base de datos
function traerAreas() {
    $.ajax({
        url: Funciones.nombreUrl() + "traer-areas",
        type: "GET",
        dataType: 'json',
        headers: { "Authorization": usuario.token },
        beforeSend: function() {},
        success: function(datos) {
            $.each(datos, function(indice, valor) {
                let html = '';
                html += '<option value="' + valor.id + '">' + valor.area + '</option>';
                $("#selectAreasMaterias").append(html);
            });
        },
        error: function() {
            window.location.href = "index";
        }
    });
}

// función donde se guardar una determinada materia
function guardarMateria(e) {
    e.preventDefault(); //No se activará la acción predeterminada del evento
    var objeto = {
        "accion": $("#id_registrar_materias").val(),
        "materia": $("#inputNombreMateria").val(),
        "area": $("#selectAreasMaterias").val()
    };
    $.ajax({
        url: Funciones.nombreUrl() + "registrar-editar-materia",
        type: "POST",
        data: objeto,
        dataType: 'json',
        headers: { "Authorization": usuario.token },
        beforeSend: function() {
            $('#div-contiene-submit-modalRegistroMaterias').html('<button  class="btn btn-info btn-lg" type="button"><i class="fa fa-spinner fa-spin"></i> <b>Validando Información</b></button>');
        },
        success: function(respuesta) {
            if (respuesta.success == true) {
                cerrarModalRegistroMaterias();
                alertify.notify(respuesta.msg, 'success', 8);
                if (gradoSeleccionado == 0) {
                    traerMateriasColegio(1);
                } else {
                    traerMateriasColegio(2);
                    //traerMateriasGrado();// esta falta
                }
            } else {
                alertify.notify(respuesta.msg, 'error', 8);
            }
            verificarAccionTomarInfoModal();
        },
        error: function(error) {
            alertify.notify('ocurrio un error al realizar el registro, por favor intentelo de nuevo', 'error', 8);
            verificarAccionTomarInfoModal();
        }
    });
}

// verificar acción a tomar para cambiar info modal
function verificarAccionTomarInfoModal() {
    if ($("#id_registrar_materias").val() == 0) {
        cambiarInfoModal(1);
    } else {
        cambiarInfoModal(2);
    }
}

// function donde se traen los grados del colegio
function traerGradosColegio() {
    totalGrados = 0;
    $.ajax({
        url: Funciones.nombreUrl() + "traer-grados",
        type: "GET",
        dataType: 'json',
        headers: { "Authorization": usuario.token },
        beforeSend: function() {},
        success: function(datos) {
            $.each(datos, function(indice, valor) {
                let html = '';
                html += '<button title="Seleccione el grado" id="btn-' + valor.id + '" class="btn btn-grados btn-outline-primary" onclick="seleccionGrado(' + valor.id + ',`' + valor.grado + '`)" >' + valor.grado + '</button>';
                $("#div-listar-grados").append(html);
                totalGrados++;
            });
        },
        error: function() {
            window.location.href = "index";
        }
    });
}

// function para traer las materias del colegio
function traerMateriasColegio(guia) {
    $("#div-listar-materias-1").html('');
    $("#div-listar-materias-2").html('');
    $("#div-listar-materias-3").html('');
    totalMaterias = 0;
    $.ajax({
        url: Funciones.nombreUrl() + "traer-materias",
        type: "GET",
        dataType: 'json',
        headers: { "Authorization": usuario.token },
        beforeSend: function() {},
        success: function(datos) {
            let cont = 1;
            $.each(datos, function(indice, valor) {
                let html = '';
                html += '<div  class="btn-group btn-group-materias">' +
                    '<button title="Debe seleccionar primero el grado"  disabled id="btn-materias-' + valor.id + '" class="btn btn-materias btn-outline-secondary" onclick="seleccionMateria(' + valor.id + ',`' + valor.materia + '`)" ><b>' + valor.materia + '</b></button>' +
                    '<button title="Editar Información"  class="btn btn-outline-warning btn-abrir-editar-materias" onclick="editarMateria(' + valor.id + ')" ><i class="fas fa-edit"></i></button>' +
                    '</div>';
                if (cont <= 18) {
                    $("#div-listar-materias-1").append(html);
                } else if (cont > 18 && cont <= 36) {
                    $("#div-listar-materias-2").append(html);
                } else if (cont > 36 && cont <= 54) {
                    $("#div-listar-materias-3").append(html);
                }
                totalMaterias++;
                cont++;
            });
            if (cont <= 17) {
                $("#div-listar-materias-1").append('<button  onclick="abrirGuardarMateria()" class="btn btn-abrir-registrar-materia btn-success"> <b>Registrar Materia</b></button>');
            } else if (cont > 17 && cont <= 35) {
                $("#div-listar-materias-2").append('<button  onclick="abrirGuardarMateria()" class="btn btn-abrir-registrar-materia btn-success"> <b>Registrar Materia</b></button>');
            } else if (cont > 35 && cont <= 53) {
                $("#div-listar-materias-3").append('<button  onclick="abrirGuardarMateria()" class="btn btn-abrir-registrar-materias btn-success"> <b>Registrar Materia</b></button>');
            }
            if (guia != 1) {
                quitarDisabledMaterias();
            }
        },
        error: function() {
            window.location.href = "index";
        }
    });
}

// function donde se selecciona un determinado grado
function seleccionGrado(id, grado) {
    nombreGradoSeleccionado = grado;
    if (id == gradoSeleccionado) {
        $("#btn-" + id).removeClass("btn-primary");
        $("#btn-" + id).addClass("btn-outline-primary");
        gradoSeleccionado = 0;
        quitarDisabledTodosGrados();
        ponerDisabledMaterias();
        ponerDisabledPeriodos();
        ponerDisabledFechas();
        quitarSeleccionMaterias();
        quitarSeleccionPeriodos();
        $("#btn-guardar-materias-grados-o-periodos").prop("disabled", true);
        $("#btn-info-grado").prop("disabled", true);
        $("#textAreaMateriasRegistradas").text("");
        verMaterias();
    } else {
        $("#btn-" + id).removeClass("btn-outline-primary");
        $("#btn-" + id).addClass("btn-primary");
        ponerDisabledTodosGradosMenosId(id);
        gradoSeleccionado = id;
        quitarDisabledMaterias();
        traerMateriasGrado();
        traerPeriodosGrado();
        $("#btn-periodo-1").prop("disabled", false);
        $("#btn-info-grado").prop("disabled", false);
    }
}

/** FUNCIONES QUE SE ACTIVAN CUANDO SE SELECCIONA UN DETERMINADO GRADO **/

// función donde se quitan los disabled de todos los grados menos del elejido
function ponerDisabledTodosGradosMenosId(id) {
    for (let i = 1; i <= totalGrados; i++) {
        $("#btn-" + i).prop("disabled", true);
        $("#btn-" + i).attr("title", "Ya hay un grado seleccionado");
    }
    $("#btn-" + id).prop("disabled", false);
    $("#btn-" + id).attr("title", "Quitar selección grado");
}

// función donde se quitan los disabled de las materias
function quitarDisabledMaterias() {
    for (let i = 1; i <= totalMaterias; i++) {
        $("#btn-materias-" + i).prop("disabled", false);
        $("#btn-materias-" + i).attr("title", "Presione para agregar la materia al grado seleccionado");
    }
}

// función donde se traen las materias registradas en un determinado grado
function traerMateriasGrado() {
    arrayMaterias = [];
    $.get("traer-materias-grado", { id_grado: gradoSeleccionado }, function(datos) {
        $.each(datos, function(indice, valor) {
            arrayMaterias.push(parseInt(valor.materia_id));
        });
        ponerSeleccionMaterias();
    });
}

// poner selección de materias
function ponerSeleccionMaterias() {
    for (let i = 0; i < arrayMaterias.length; i++) {
        $("#btn-materias-" + arrayMaterias[i]).removeClass("btn-outline-secondary");
        $("#btn-materias-" + arrayMaterias[i]).addClass("btn-secondary");
        $("#btn-materias-" + arrayMaterias[i]).attr("title", "Presione para quitar la materia del grado seleccionado");
    }
    if (arrayMaterias.length > 0 && $("#btn-guardar-materias-grados-o-periodos").val() == 1) {
        $("#btn-guardar-materias-grados-o-periodos").prop("disabled", false);
    }
}

// función donde se traen los periodos de los grados
function traerPeriodosGrado() {
    arrayPeriodos = [];
    arrayFechasInicio = [];
    arrayFechasFinal = [];
    arrayPorcentajes = [];
    $.get("traer-periodos-grados", { id_grado: gradoSeleccionado }, function(datos) {
        console.log("Estos son los datos que llegan", datos);
        $.each(datos, function(indice, valor) {
            arrayPeriodos.push(parseInt(valor.periodo));
            arrayFechasInicio.push(valor.fecha_inicio);
            arrayFechasFinal.push(valor.fecha_final);
            arrayPorcentajes.push(valor.porcentaje);
        });
        ponerSeleccionPeriodos();
    });
}

// función donde se pone la selección de los periodos
function ponerSeleccionPeriodos() {
    for (let i = 0; i < arrayPeriodos.length; i++) {
        $("#btn-periodo-" + arrayPeriodos[i]).removeClass("btn-outline-secondary");
        $("#btn-periodo-" + arrayPeriodos[i]).addClass("btn-secondary");
        $("#btn-periodo-" + arrayPeriodos[i]).prop("disabled", false);
        $("#div-contiene-form-periodos-" + arrayPeriodos[i]).show();
        $("#inputPorcentaje" + arrayPeriodos[i]).val(arrayPorcentajes[i]);
        $("#inputFechaInicio" + arrayPeriodos[i]).val(arrayFechasInicio[i]);
        $("#inputFechaInicio" + arrayPeriodos[i]).prop("disabled", false);
        $("#inputFechaFinal" + arrayPeriodos[i]).val(arrayFechasFinal[i]);
        $("#inputFechaFinal" + arrayPeriodos[i]).prop("disabled", false);
    }
    if (arrayPeriodos.length > 0 && $("#btn-guardar-materias-grados-o-periodos").val() == 2) {
        $("#btn-guardar-materias-grados-o-periodos").prop("disabled", false);
    }
}

/**  FINAL FUNCIONES QUE SE ACTIVAN CUANDO SE QUITA LA SELECCIÓN DE UN GRADO **/

/**  FUNCIONES QUE SE ACTIVAN CUANDO SE QUITA LA SELECCIÓN DE UN GRADO **/
// función donde se quita el disabled de todos los grados
function quitarDisabledTodosGrados() {
    for (let i = 1; i <= totalGrados; i++) {
        $("#btn-" + i).prop("disabled", false);
        $("#btn-" + i).attr("title", "Seleccione el grado");
    }
}
// función donde se ponen los disabled a todas las materias
function ponerDisabledMaterias() {
    for (let i = 1; i <= totalMaterias; i++) {
        $("#btn-materias-" + i).prop("disabled", true);
        $("#btn-materias-" + i).attr("title", "Debe seleccionar primero el grado")
    }
}

// función donde se pone el disabled de los periodos
function ponerDisabledPeriodos() {
    for (let i = 1; i <= 4; i++) {
        $("#btn-periodo-" + i).prop("disabled", true);
    }
}

// función donde se ponen los disabled de las fechas
function ponerDisabledFechas() {
    for (let i = 1; i <= 4; i++) {
        if (i != 1) {
            $("#inputFechaInicio" + i).removeAttr("min");
            $("#inputFechaInicio" + i).prop("disabled", true);
        }
        $("#inputFechaFinal" + i).removeAttr("min");
        $("#inputFechaFinal" + i).prop("disabled", true);
    }
}

// quitar selección materias
function quitarSeleccionMaterias() {
    for (let i = 0; i < arrayMaterias.length; i++) {
        $("#btn-materias-" + arrayMaterias[i]).removeClass("btn-secondary");
        $("#btn-materias-" + arrayMaterias[i]).addClass("btn-outline-secondary");
    }
    arrayMaterias = [];
}

// función donde se muestra la columna con los detemrinados periodos
function verMaterias() {
    if (arrayMaterias.length == 0) {
        $("#btn-guardar-materias-grados-o-periodos").prop("disabled", true);
    } else {
        $("#btn-guardar-materias-grados-o-periodos").prop("disabled", false);
    }
    $("#btn-guardar-materias-grados-o-periodos").val(1);
    $("#btn-ver-periodos").removeClass("btn-dark");
    $("#btn-ver-periodos").addClass("btn-outline-dark");
    $("#btn-info-grado").removeClass("btn-dark");
    $("#btn-info-grado").addClass("btn-outline-dark");
    $("#btn-ver-materias").removeClass("btn-outline-dark");
    $("#btn-ver-materias").addClass("btn-dark");
    $(".div-periodos").css("display", "none");
    $(".div-informe").css("display", "none");
    $(".div-materias").css("display", "block");
    esconder_divs_informe();
}

/** FINAL FUNCIONES QUE SE ACTIVAN CUANDO SE SELECCIONA UN DETERMINADO GRADO **/

// function donde se seleccionan las materias para agregarlas al grado seleccionado
function seleccionMateria(id, materia) {
    if (arrayMaterias.includes(id)) {
        var i = arrayMaterias.indexOf(id);
        arrayMaterias.splice(i, 1);
        $("#btn-materias-" + id).removeClass("btn-secondary");
        $("#btn-materias-" + id).addClass("btn-outline-secondary");
        $("#btn-materias-" + id).attr("title", "Presione para agregar materia al grado seleccionado");
    } else {
        arrayMaterias.push(id);
        $("#btn-materias-" + id).removeClass("btn-outline-secondary");
        $("#btn-materias-" + id).addClass("btn-secondary");
        $("#btn-materias-" + id).attr("title", "Presione para quitar la materia del grado seleccionado");
    }

    if (arrayMaterias.length > 0) {
        $("#btn-guardar-materias-grados-o-periodos").prop("disabled", false);
    } else {
        $("#btn-guardar-materias-grados-o-periodos").prop("disabled", true);
    }
    console.log(arrayMaterias);
}

// quitar selección periodos
function quitarSeleccionPeriodos() {
    for (let i = 0; i < arrayPeriodos.length; i++) {
        $("#btn-periodo-" + arrayPeriodos[i]).removeClass("btn-secondary");
        $("#btn-periodo-" + arrayPeriodos[i]).addClass("btn-outline-secondary");
        $("#div-contiene-form-periodos-" + arrayPeriodos[i]).hide();
    }
    arrayMaterias = [];
}

/** FUNCIONES QUE SE ACTIVAN CON EL BOTÓN DE GUARDAR **/
// función donde se elije que acción es la que se va tomar si guardarMaterias o guardarPeriodos
function guardarMateriasOrPeriodosGrados(guia) {
    if (guia == 1) {
        guardarMaterias();
    } else {
        guardarPeriodos();
    }
}

// función donde se guardan las materias de los grados
function guardarMaterias() {
    $.ajax({
        type: "POST",
        url: "guardar-materias-grado",
        data: { 'array': JSON.stringify(arrayMaterias), 'idGrado': gradoSeleccionado },
        beforeSend: function() {
            abrirModalCargando();
        },
        success: function(data) {
            if (data.success == true) {
                Biblioteca.notificaciones(data.msg, 'Edusoft', 'success');
            } else {
                Biblioteca.notificaciones(data.msg, 'Edusoft', 'error');
            }
            cerrarModalCargando();
        },
        error: function(error) {
            Biblioteca.notificaciones("ocurrio un error al realizar el registro de las materias, por favor intentelo de nuevo", 'Edusoft', 'error');
            cerrarModalCargando();
        }
    });
}

/** FINAL FUNCIONES QUE SE ACTIVAN CON EL BOTÓN DE GUARDAR **/



// función para abrir el modal para registrar una materia las materias
function abrirGuardarMateria() {
    $("#modalRegistroMaterias").modal("show");
    cambiarInfoModal(1);
}

function cambiarInfoModal(guia) {
    if (guia == 1) {
        $("#id-titulo-modalRegistroMaterias").text("Registro Materia");
        $("#div-contiene-submit-modalRegistroMaterias").html('<button type="submit"  class="btn btn-success"><i class="fa fa-save"></i> Guardar</button>');
    } else {
        $("#id-titulo-modalRegistroMaterias").text("Editar Materia");
        $("#div-contiene-submit-modalRegistroMaterias").html('<button type="submit"  class="btn btn-warning"><i class="fa fa-edit"></i> Editar</button>');
    }
}

// función donde se abre el modal para editar la materia
function editarMateria(id) {
    $("#modalRegistroMaterias").modal("show");
    $("#id_registrar_materias").val(id);
    let objeto = { "id": id };
    $.ajax({
        url: Funciones.nombreUrl() + "traer-info-materia",
        type: "GET",
        data: objeto,
        dataType: 'json',
        headers: { "Authorization": usuario.token },
        beforeSend: function() { Funciones.abrirModalCargando(); },
        success: function(datos) {
            $("#inputNombreMateria").val(datos.materia);
            $("#selectAreasMaterias").val(datos.id_area);
            Funciones.cerrarModalCargando();
        },
        error: function() {
            Funciones.cerrarModalCargando();
            Funciones.expiracion();
        }
    });
    cambiarInfoModal(2);
}

function cerrarModalRegistroMaterias() {
    $("#modalRegistroMaterias").modal("hide");
    $("#formRegistroMaterias")[0].reset();
    $("#id_registrar_materias").val(0);
}

// función donde se ven los determinados periodos de una materia
function verPeriodos() {
    if (arrayPeriodos.length == 0) {
        $("#btn-guardar-materias-grados-o-periodos").prop("disabled", true);
    } else {
        $("#btn-guardar-materias-grados-o-periodos").prop("disabled", false);
    }
    $("#btn-guardar-materias-grados-o-periodos").val(2);
    $("#btn-ver-materias").removeClass("btn-dark");
    $("#btn-ver-materias").addClass("btn-outline-dark");
    $("#btn-info-grado").removeClass("btn-dark");
    $("#btn-info-grado").addClass("btn-outline-dark");
    $("#btn-ver-periodos").removeClass("btn-outline-dark");
    $("#btn-ver-periodos").addClass("btn-dark");
    $(".div-materias").css("display", "none");
    $(".div-informe").css("display", "none");
    $(".div-periodos").css("display", "block");
    esconder_divs_informe();
}

// función donde se elije un determinado periodo
function eleccionPeriodo(periodo) {
    if (arrayPeriodos.includes(periodo)) {
        for (let i = periodo; periodo <= arrayPeriodos.length; i++) {
            let indice = arrayPeriodos.indexOf(i);
            arrayPeriodos.splice(indice, 1);
            $("#btn-periodo-" + i).removeClass("btn-secondary");
            $("#btn-periodo-" + i).addClass("btn-outline-secondary");
            $("#div-contiene-form-periodos-" + i).hide();
            if (i != periodo) {
                $("#btn-periodo-" + i).prop("disabled", true);
            }
        }
    } else {
        arrayPeriodos.push(periodo);
        $("#btn-periodo-" + periodo).removeClass("btn-outline-secondary");
        $("#btn-periodo-" + periodo).addClass("btn-secondary");
        $("#div-contiene-form-periodos-" + periodo).show();
        $("#btn-periodo-" + (periodo + 1)).prop("disabled", false);
    }

    if (arrayPeriodos.length > 0) {
        $("#btn-guardar-materias-grados-o-periodos").prop("disabled", false);
    } else {
        $("#btn-guardar-materias-grados-o-periodos").prop("disabled", true);
    }
    console.log(arrayPeriodos);
}

// función donde se guardan los periodos
function guardarPeriodos() {
    abrirModalCargando();
    arrayFechasInicio = [];
    arrayFechasFinal = [];
    arrayPorcentajes = [];
    var cuentaPorcentaje = 0;
    for (let i = 1; i <= arrayPeriodos.length; i++) {
        if ($("#inputPorcentaje" + i).val() != "") {
            cuentaPorcentaje = parseInt($("#inputPorcentaje" + i).val()) + cuentaPorcentaje;
            arrayPorcentajes.push($("#inputPorcentaje" + i).val());
        }
        if ($("#inputFechaInicio" + i).val() != "") {
            arrayFechasInicio.push($("#inputFechaInicio" + i).val());
        }
        if ($("#inputFechaFinal" + i).val() != "") {
            arrayFechasFinal.push($("#inputFechaFinal" + i).val());
        }
    }

    console.log("Este es el json: ", JSON.stringify(arrayFechasInicio));

    if ((arrayPorcentajes.length == arrayPeriodos.length) && (arrayFechasInicio.length == arrayPeriodos.length) &&
        (arrayFechasFinal.length == arrayPeriodos.length) && (cuentaPorcentaje == 100)) {
        $.ajax({
            type: "POST",
            url: "guardar-periodos-grado",
            data: { 'arrayPeriodos': JSON.stringify(arrayPeriodos), 'arrayFechasInicio': JSON.stringify(arrayFechasInicio), 'arrayFechasFinal': JSON.stringify(arrayFechasFinal), 'arrayPorcentajes': JSON.stringify(arrayPorcentajes), 'idGrado': gradoSeleccionado },
            beforeSend: function() {
                $("#cargando").modal("show");
            },
            success: function(data) {
                cerrarModalCargando();
                if (data.success == true) {
                    Biblioteca.notificaciones(data.msg, 'Edusoft', 'success');
                } else {
                    Biblioteca.notificaciones(data.msg, 'Edusoft', 'error');
                }
            },
            error: function(error) {
                Biblioteca.notificaciones("Se presento un problema en el servidor al realizar el registro, por favor intentelo de nuevo", 'Edusoft', 'error');
                cerrarModalCargando();
            }
        });
    } else {
        Biblioteca.notificaciones("Debe digitar todos los porcentajes, fechas de inicio y fechas finales de los periodos elejidos y la suma de los porcentajes debe sumar el 100%", 'Edusoft', 'error');
        cerrarModalCargando();
    }
}

// función donde se ve la información de un determinado grado
function verInfoGrado() {
    abrirModalCargando();
    $("#btn-ver-periodos").removeClass("btn-dark");
    $("#btn-ver-periodos").addClass("btn-outline-dark");
    $("#btn-ver-materias").removeClass("btn-dark");
    $("#btn-ver-materias").addClass("btn-outline-dark");
    $("#btn-info-grado").removeClass("btn-outline-dark");
    $("#btn-info-grado").addClass("btn-dark");
    $("#btn-guardar-materias-grados-o-periodos").prop("disabled", true);
    $(".div-periodos").css("display", "none");
    $(".div-materias").css("display", "none");
    $(".div-informe").css("display", "block");
    traerInformacionGrado();
    traerPeriodosGradoMostrarInfo();
    cerrarModalCargando();
}

// función donde se trae la información de un determinado grado
function traerInformacionGrado() {
    $("#id-ul-listarMaterias").html("");
    $("#id-ul-listarMaterias").html('<li class = "list-group-item list-group-item-primary" >Materias Registradas ' + nombreGradoSeleccionado + '</li>');
    $.get("traer-nombre-materias-grado", { id_grado: gradoSeleccionado }, function(datos) {
        let cont = 1;
        $.each(datos, function(indice, valor) {
            $("#id-ul-listarMaterias").append('<li class = "list-group-item list-group-item-light" >' + cont + '- ' + valor.materia + '</li>');
            cont++;
        });
    });
}

// función donde se traen los periodos de los grados
function traerPeriodosGradoMostrarInfo() {
    $.get("traer-periodos-grados", { id_grado: gradoSeleccionado }, function(datos) {
        let cont = 1;
        $.each(datos, function(indice, valor) {
            $('#card_info_' + cont).show();
            $('#info_fecha_inicio_' + cont).text(valor.fecha_inicio);
            $('#info_fecha_final_' + cont).text(valor.fecha_final);
            $('#info_porcentaje_' + cont).text(valor.porcentaje + "%");
            cont++;
        });
    });
}

// función para esconder los div de informe
function esconder_divs_informe() {
    for (let index = 1; index <= 4; index++) {
        $('#card_info_' + index).hide();
    }
}