// datitos de prueba

const datos = [
    {
        nombre: "Camila Paredes",
        correo: "camistar03@gmail.com",
        telefono: "5715 5429",
        tipoMiembro: "Pregrado",
        actividad: "GYM",
        tipoActividad: "Deporte"
    },
    {
        nombre: "Shiro",
        correo: "gatopesao@gmail.com",
        telefono: "1234 1234",
        tipoMiembro: "Postgrado",
        actividad:"morder",
        tipoActividad:"Artístico"
    }
]

const tablita = document.getElementById("tabla-body");

function renderizarTablita(lista){
    tablita.innerHTML = "";

    lista.forEach((miembro) =>{
        const fila = document.createElement("tr");

        const tdNombre = document.createElement("td");
        tdNombre.textContent = miembro.nombre;

        const tdCorreo = document.createElement("td");
        tdCorreo.textContent = miembro.correo;

        const tdTelefono = document.createElement("td");
        tdTelefono.textContent = "+56 9" + miembro.telefono; // arreglo formato telefono

        const tdTipoMiembro = document.createElement("td");
        tdTipoMiembro.textContent = miembro.tipoMiembro;

        const tdActividad = document.createElement("td");
        tdActividad.textContent = miembro.actividad;

        const tdTipoActividad = document.createElement("td");
        tdTipoActividad.textContent = miembro.tipoActividad;



        fila.appendChild(tdNombre);
        fila.appendChild(tdCorreo);
        fila.appendChild(tdTelefono);
        fila.appendChild(tdTipoMiembro);
        fila.appendChild(tdActividad);
        fila.appendChild(tdTipoActividad);

        tablita.appendChild(fila);


    });
}

renderizarTablita(datos);

const filtroMiembro = document.getElementById("filtro-miembro");
const filtroActividad = document.getElementById("filtro-actividad")


// filtrooooooooooooos 

function aplicarFiltros() {
    const valorMiembro = filtroMiembro.value;
    const valorActividad = filtroActividad.value;

    let filtrados = datos;
    // por tipo de miembro (pregrado, postgrado, funcionario, academico)
    if (valorMiembro !== "todos") {
        filtrados = filtrados.filter(m => m.tipoMiembro === valorMiembro);
    }
    // por tipo de actividad (deporte, artistico, social, etc)
    if (valorActividad !== "todos") {
        filtrados = filtrados.filter(m => m.tipoActividad === valorActividad);
    }

    renderizarTablita(filtrados);
}


filtroMiembro.addEventListener("change", aplicarFiltros);
filtroActividad.addEventListener("change", aplicarFiltros);