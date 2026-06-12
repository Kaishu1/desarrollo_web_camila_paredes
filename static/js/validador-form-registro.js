const formRegistro = document.getElementById("form-registro");

const validarNombre = (nombre) => {
    return nombre && nombre.trim().length > 2 && nombre.trim().length <= 50;
};

const validarCorreo = (correo) => {
    return correo && correo.includes("@") && correo.length <= 80;
};

const validarTelefono = (telefono) => {
    return telefono && telefono.replace(/\s+/g, "").trim().length === 8;
};

const validarSeleccion = (opcion) => {
    return opcion && opcion.trim() !== "";
};

const etiquetasDetalleTipoMiembro = {
    "Estudiante de Pregrado": "Año de ingreso",
    "Estudiante de Postgrado": "Programa",
    "Funcionario(a)": "Cargo",
    "Académico(a)": "Área académica",
};

const validarNombreActividad = (actividad) => {
    return actividad && actividad.trim().length > 3;
};

const validarDuracion = (duracion) => {
    return duracion && /^\d{2}:\d{2}$/.test(duracion.trim());
};

function mostrarError(idError, esValido) {
    const error = document.getElementById(idError);

    if (error) {
        error.classList.toggle("visible", !esValido);
    }
}

function validarFormRegistro(event) {
    const inputNombre = document.getElementById("nombre");
    const inputCorreo = document.getElementById("correo");
    const inputTelefono = document.getElementById("telefono");
    const inputTipoMiembro = document.getElementById("tipo_miembro");
    const inputDetalleTipoMiembro = document.getElementById("detalle_tipo_miembro");
    const inputRegion = document.getElementById("region");
    const inputComuna = document.getElementById("comuna");
    const inputNombreActividad = document.getElementById("nombreActividad");
    const inputTipoActividad = document.getElementById("tipoActividad");
    const inputDescripcion = document.getElementById("descripcion");
    const inputDia = document.getElementById("dia");
    const inputHoraInicio = document.getElementById("horaInicio");
    const inputDuracion = document.getElementById("duracion");

    const nombreValido = validarNombre(inputNombre.value);
    const correoValido = validarCorreo(inputCorreo.value);
    const telefonoValido = validarTelefono(inputTelefono.value);
    const tipoMiembroValido = validarSeleccion(inputTipoMiembro.value);
    const detalleTipoMiembroValido = validarSeleccion(inputDetalleTipoMiembro.value);
    const regionValida = validarSeleccion(inputRegion.value);
    const comunaValida = validarSeleccion(inputComuna.value);
    const nombreActividadValido = validarNombreActividad(inputNombreActividad.value);
    const tipoActividadValido = validarSeleccion(inputTipoActividad.value);
    const descripcionValida = validarSeleccion(inputDescripcion.value);
    const diaValido = validarSeleccion(inputDia.value);
    const horaInicioValida = validarSeleccion(inputHoraInicio.value);
    const duracionValida = validarDuracion(inputDuracion.value);

    mostrarError("errorNombre", nombreValido);
    mostrarError("errorCorreo", correoValido);
    mostrarError("errorTelefono", telefonoValido);
    mostrarError("errorTipoMiembro", tipoMiembroValido);
    mostrarError("errorDetalleTipoMiembro", detalleTipoMiembroValido);
    mostrarError("errorRegion", regionValida);
    mostrarError("errorComuna", comunaValida);
    mostrarError("errorNombreActividad", nombreActividadValido);
    mostrarError("errorTipoActividad", tipoActividadValido);
    mostrarError("errorDescripcion", descripcionValida);
    mostrarError("errorDia", diaValido);
    mostrarError("errorHoraInicio", horaInicioValida);
    mostrarError("errorDuracion", duracionValida);

    const formularioValido =
        nombreValido &&
        correoValido &&
        telefonoValido &&
        tipoMiembroValido &&
        detalleTipoMiembroValido &&
        regionValida &&
        comunaValida &&
        nombreActividadValido &&
        tipoActividadValido &&
        descripcionValida &&
        diaValido &&
        horaInicioValida &&
        duracionValida;

    if (!formularioValido) {
        event.preventDefault();
    }
}

function actualizarDetalleTipoMiembro() {
    const inputTipoMiembro = document.getElementById("tipo_miembro");
    const contenedorDetalle = document.getElementById("contenedor_detalle_tipo_miembro");
    const labelDetalle = document.getElementById("label_detalle_tipo_miembro");
    const inputDetalle = document.getElementById("detalle_tipo_miembro");
    const etiqueta = etiquetasDetalleTipoMiembro[inputTipoMiembro.value];

    if (!etiqueta) {
        contenedorDetalle.hidden = true;
        inputDetalle.value = "";
        inputDetalle.type = "text";
        inputDetalle.removeAttribute("min");
        inputDetalle.removeAttribute("max");
        return;
    }

    labelDetalle.textContent = etiqueta;
    inputDetalle.type = inputTipoMiembro.value === "Estudiante de Pregrado" ? "number" : "text";

    if (inputTipoMiembro.value === "Estudiante de Pregrado") {
        inputDetalle.min = "1900";
        inputDetalle.max = "2100";
    } else {
        inputDetalle.removeAttribute("min");
        inputDetalle.removeAttribute("max");
    }

    contenedorDetalle.hidden = false;
}

document.getElementById("tipo_miembro").addEventListener("change", actualizarDetalleTipoMiembro);
actualizarDetalleTipoMiembro();
formRegistro.addEventListener("submit", validarFormRegistro);
