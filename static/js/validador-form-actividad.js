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


    // nombre Actividad
    if (!validarNombreActividad(inputNombreActividad.value)) {
        errorNombreActividad.classList.add('visible')
    } else {
        errorNombreActividad.classList.remove('visible')
    };

    // tipo actividad
    if(!validarTipoActividad(inputTipoActividad.value)) {
        errorTipoActividad.classList.add('visible')
    }else{
        errorTipoActividad.classList.remove('visible')
    };

    // horas semanales 
    if(!validarHoras(inputHoras.value)){
        errorHorasActividad.classList.add('visible')
    }else{
        errorHorasActividad.classList.remove('visible')
    };

}

formActividad.addEventListener("submit", validarFormActividad);