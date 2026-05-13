// --- Validadores de actividad --
const formActividad = document.getElementById("form-actividad");

const validarNombreActividad = (actividad) => {
    let valido = false;
    if(actividad && actividad.length > 3) {
        valido = true;
    }return valido;
};

const validarTipoActividad = (opcion) => {
    if (!opcion)
        return false;
    return true;
};

const validarHoras = (horas) => {
    let valido = false;
    if(horas>= 1 && horas <=40){
        valido = true
    } return valido;
};






// FORMULARIO ACTIVIDAD
function validarFormActividad(event) {
    event.preventDefault(); // pa que no se recargue la página 
    console.log("Enviando..."); 

    // obtenemo elementos del DOM por el id
    let inputNombreActividad = document.getElementById("nombreActividad");
    let inputTipoActividad = document.getElementById("tipoActividad");
    let inputHoras = document.getElementById("horasActividad");

    let errorNombreActividad = document.getElementById("errorNombreActividad");
    let errorTipoActividad = document.getElementById("errorTipoActividad");
    let errorHorasActividad = document.getElementById("errorHorasActividad");

    let mensajeExitoActividad = document.getElementById("mensajeExitoActividad");

    let nombreActividadValido = validarNombreActividad(inputNombreActividad.value);
    let tipoActividadValido = validarTipoActividad(inputTipoActividad.value);
    let horasValido = validarHoras(inputHoras.value);



    // nombre Actividad
    if (!nombreActividadValido) {
        errorNombreActividad.classList.add('visible')
    } else {
        errorNombreActividad.classList.remove('visible')
    };

    // tipo actividad
    if(!tipoActividadValido) {
        errorTipoActividad.classList.add('visible')
    }else{
        errorTipoActividad.classList.remove('visible')
    };

    // horas semanales 
    if(!horasValido){
        errorHorasActividad.classList.add('visible')
    }else{
        errorHorasActividad.classList.remove('visible')
    };

    

    let formularioValido = nombreActividadValido &&
    tipoActividadValido &&
    horasValido;

    if (formularioValido) {
        mensajeExitoActividad.classList.add("visible");
        formActividad.reset();
    } else {
        mensajeExitoActividad.classList.remove("visible");
    }

}

formActividad.addEventListener("submit", validarFormActividad);