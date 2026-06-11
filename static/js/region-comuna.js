const regionSelect = document.getElementById("region");
const comunaSelect = document.getElementById("comuna");

function reiniciarComunas(texto = "-- Seleccione comuna --") {
    comunaSelect.innerHTML = "";

    const opcionInicial = document.createElement("option");
    opcionInicial.value = "";
    opcionInicial.textContent = texto;
    comunaSelect.appendChild(opcionInicial);

    comunaSelect.disabled = true;
}

async function cargarComunas(regionId) {
    reiniciarComunas("Cargando comunas...");

    await fetch(`/comunas/${regionId}`)
        .then((respuesta) => {
            if (!respuesta.ok) {
                throw new Error("No se pudieron cargar las comunas");
            }

            return respuesta.json();
        })
        .then((comunas) => {
            mostrarComunas(comunas);
        })
        .catch(() => {
            reiniciarComunas("Error al cargar comunas");
        });
}

function mostrarComunas(comunas) {
    reiniciarComunas("-- Seleccione comuna --");

    for (const comuna of comunas) {
        const opcion = document.createElement("option");
        opcion.value = comuna.id;
        opcion.textContent = comuna.nombre;
        comunaSelect.appendChild(opcion);
    }

    comunaSelect.disabled = comunas.length === 0;
}

regionSelect.addEventListener("change", () => {
    const regionId = regionSelect.value;

    if (!regionId) {
        reiniciarComunas();
        return;
    }

    cargarComunas(regionId);
});
