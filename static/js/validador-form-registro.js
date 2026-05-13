const formRegistro = document.getElementById("form-registro");

// Validadores de miembro
const validarNombre = (nombre) => {
    return nombre && nombre.length > 2 && nombre.length <= 50;
};

const validarCorreo = (correo) => {
    return correo && correo.includes("@");
};

const validarTelefono = (telefono) => {
    return telefono && telefono.replace(/\s+/g, "").trim().length === 8;
};

const validarTelegram = (telegram) => {
    return telegram;
};

const validarTipoMiembro = (opcion) => {
    return opcion;
};

// Validadores de actividad
const validarNombreActividad = (actividad) => {
    return actividad && actividad.length > 3;
};

const validarTipoActividad = (opcion) => {
    return opcion;
};

const validarHoras = (horas) => {
    return horas >= 1 && horas <= 40;
};

const validarImagen = (inputImagen) => {
    return inputImagen.files.length > 0;
};

function validarFormRegistro(event) {
    // Primero evitamos que se envíe automáticamente.
    // Si todo está válido, al final lo enviamos con formRegistro.submit().
    event.preventDefault();

    // inputs miembro
    let inputNombre = document.getElementById("nombre");
    let inputCorreo = document.getElementById("correo");
    let inputTelefono = document.getElementById("telefono");
    let inputTelegram = document.getElementById("telegram");
    let inputTipoMiembro = document.getElementById("tipoMiembro");

    // errores miembro
    let errorNombre = document.getElementById("errorNombre");
    let errorCorreo = document.getElementById("errorCorreo");
    let errorTelefono = document.getElementById("errorTelefono");
    let errorTelegram = document.getElementById("errorTelegram");
    let errorTipoMiembro = document.getElementById("errorTipoMiembro");

    // inputs actividad
    let inputNombreActividad = document.getElementById("nombreActividad");
    let inputTipoActividad = document.getElementById("tipoActividad");
    let inputHoras = document.getElementById("horasActividad");
    let inputImagenActividad = document.getElementById("imagenActividad");

    // errores actividad
    let errorNombreActividad = document.getElementById("errorNombreActividad");
    let errorTipoActividad = document.getElementById("errorTipoActividad");
    let errorHorasActividad = document.getElementById("errorHorasActividad");
    let errorImagenActividad = document.getElementById("errorImagenActividad");

    // validaciones miembro
    let nombreValido = validarNombre(inputNombre.value);
    let correoValido = validarCorreo(inputCorreo.value);
    let telefonoValido = validarTelefono(inputTelefono.value);
    let telegramValido = validarTelegram(inputTelegram.value);
    let tipoMiembroValido = validarTipoMiembro(inputTipoMiembro.value);

    // validaciones actividad
    let nombreActividadValido = validarNombreActividad(inputNombreActividad.value);
    let tipoActividadValido = validarTipoActividad(inputTipoActividad.value);
    let horasValido = validarHoras(inputHoras.value);
    let imagenValida = validarImagen(inputImagenActividad);

    // mostrar/ocultar errores miembro
    errorNombre.classList.toggle("visible", !nombreValido);
    errorCorreo.classList.toggle("visible", !correoValido);
    errorTelefono.classList.toggle("visible", !telefonoValido);
    errorTelegram.classList.toggle("visible", !telegramValido);
    errorTipoMiembro.classList.toggle("visible", !tipoMiembroValido);

    // mostrar/ocultar errores actividad
    errorNombreActividad.classList.toggle("visible", !nombreActividadValido);
    errorTipoActividad.classList.toggle("visible", !tipoActividadValido);
    errorHorasActividad.classList.toggle("visible", !horasValido);
    errorImagenActividad.classList.toggle("visible", !imagenValida);

    let formularioValido =
        nombreValido &&
        correoValido &&
        telefonoValido &&
        telegramValido &&
        tipoMiembroValido &&
        nombreActividadValido &&
        tipoActividadValido &&
        horasValido &&
        imagenValida;

    if (formularioValido) {
        formRegistro.submit();
    } else {
        const mensajeExito = document.getElementById("mensajeExitoFormulario");
        mensajeExito.classList.remove("visible");
    }
}

formRegistro.addEventListener("submit", validarFormRegistro);