// datitos de prueba

const datos = [
    {
        nombre: "Camila Paredes",
        correo: "camistar03@gmail.com",
        telefono: "57155429",
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

datos.forEach((miembro) => {
    const fila = document.createElement("tr");

    const tdNombre = document.createElement("td");
    tdNombre.textContent = miembro.nombre;

    const tdCorreo = document.createElement("td");
    tdCorreo.textContent = miembro.correo;

    const tdTelefono = document.createElement("td");
    tdTelefono.textContent = miembro.telefono;

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

