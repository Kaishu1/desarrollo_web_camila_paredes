const formRegistro = document.getElementById("form-registro");

const validarNombre = (nombre) => {
    let valido = false;
    if(nombre && nombre.length > 2 && nombre.length <= 50) {
        valido = true;
    }return valido;
};

const validarCorreo = (correo) => {
    let valido = false;
    if (correo && correo.includes("@")){
        valido = true;
    }return valido
}

const validarTelefono = (telefono) => {
    let valido = false;
    if (telefono && telefono.replace(/\s+/g, "").trim().length == 8){ // 8 digitos sin contar espacios
        valido = true;
    } return valido;
}
const validarTelegram = (telegram) => {
    let valido = false;
    if (telegram) {
        valido = true;
    }return valido
}

const validarTipoMiembro = (opcion) => {
    if (!opcion)
        return false;
    return true;
};


// Formulario de Registro 

function validarFormRegistro(event) {
    event.preventDefault()
    console.log("Enviando..."); 

    // obtenemo elementos del DOM por el id

    let inputNombre = document.getElementById("nombre");
    let inputCorreo = document.getElementById("correo");
    let inputTelefono = document.getElementById("telefono");
    let inputTelegram = document.getElementById("telegram");
    let inputTipoMiembro = document.getElementById("tipoMiembro");

    let errorNombre = document.getElementById("errorNombre");
    let errorCorreo = document.getElementById("errorCorreo");
    let errorTelefono = document.getElementById("errorTelefono");
    let errorTelegram = document.getElementById("errorTelegram");
    let errorTipoMiembro = document.getElementById("errorTipoMiembro");

    let mensajeExito = document.getElementById("mensajeExitoRegistro");

    let nombreValido = validarNombre(inputNombre.value);
    let correoValido = validarCorreo(inputCorreo.value);
    let telefonoValido = validarTelefono(inputTelefono.value);
    let telegramValido = validarTelegram(inputTelegram.value);
    let tipoMiembroValido = validarTipoMiembro(inputTipoMiembro.value);


    if(!nombreValido){
        errorNombre.classList.add('visible')
    }else{
        errorNombre.classList.remove('visible')
    }

    if(!correoValido){
        errorCorreo.classList.add('visible')
    }else{
        errorCorreo.classList.remove('visible')
    }
    
    if(!telefonoValido){
        errorTelefono.classList.add('visible')
    }else{
        errorTelefono.classList.remove('visible')
    }

    if(!telegramValido){
        errorTelegram.classList.add('visible')
    }else{
        errorTelegram.classList.remove('visible')
    }

    if(!tipoMiembroValido){
        errorTipoMiembro.classList.add('visible')
    }else{
        errorTipoMiembro.classList.remove('visible')
    }

    let formularioValido = nombreValido &&
        correoValido &&
        telefonoValido &&
        telegramValido &&
        tipoMiembroValido;

    if (formularioValido) {
        mensajeExito.classList.add("visible");
        formRegistro.reset();
    } else {
        mensajeExito.classList.remove("visible");
    }
}

formRegistro.addEventListener("submit", validarFormRegistro);