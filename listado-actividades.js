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
    },
    {
        nombre: "Juan Pérez",
        correo: "juanp@gmail.com",
        telefono: "98765432",
        tipoMiembro: "Funcionario",
        actividad: "Fútbol",
        tipoActividad: "Deporte"
    },
    {
        nombre: "María López",
        correo: "maria@gmail.com",
        telefono: "91234567",
        tipoMiembro: "Académico",
        actividad: "Investigación",
        tipoActividad: "Educativo"
    },
    {
        nombre: "Pedro González",
        correo: "pedro@gmail.com",
        telefono: "99887766",
        tipoMiembro: "Pregrado",
        actividad: "Voluntariado",
        tipoActividad: "Social / Voluntariado"
    },
    {
        nombre: "Ana Torres",
        correo: "ana@gmail.com",
        telefono: "93456789",
        tipoMiembro: "Postgrado",
        actividad: "Pintura",
        tipoActividad: "Artístico"
    },
    {
        nombre: "Diego Rojas",
        correo: "diego@gmail.com",
        telefono: "94561234",
        tipoMiembro: "Funcionario",
        actividad: "Yoga",
        tipoActividad: "Recreativo"
    },
    {
        nombre: "Laura Martínez",
        correo: "laura@gmail.com",
        telefono: "95671234",
        tipoMiembro: "Académico",
        actividad: "Charlas",
        tipoActividad: "Educativo"
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