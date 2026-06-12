document.addEventListener("DOMContentLoaded", () => {
  const tarjetas = document.querySelectorAll(".actividad-foro[data-actividad-id]");

  tarjetas.forEach((tarjeta) => {
    const actividadId = tarjeta.dataset.actividadId;
    const formulario = tarjeta.querySelector(".form-comentario");

    cargarComentarios(tarjeta, actividadId);

    if (formulario) {
      formulario.addEventListener("submit", (event) => {
        event.preventDefault();
        enviarComentario(tarjeta, actividadId, formulario);
      });
    }
  });
});

function mostrarError(tarjeta, mensaje) {
  const error = tarjeta.querySelector("[data-comentarios-error]");

  if (error) {
    error.textContent = mensaje;
  }
}

function limpiarError(tarjeta) {
  mostrarError(tarjeta, "");
}

function cargarComentarios(tarjeta, actividadId) {
  const contenedor = tarjeta.querySelector("[data-comentarios-lista]");

  if (!contenedor) {
    return;
  }

  fetch(`/api/actividad/${actividadId}/comentarios`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("No se pudieron cargar los comentarios");
      }
      return response.json();
    })
    .then((comentarios) => {
      contenedor.innerHTML = "";

      if (comentarios.length === 0) {
        contenedor.textContent = "Todavía no hay comentarios.";
        return;
      }

      comentarios.forEach((comentario) => {
        const item = document.createElement("div");
        item.classList.add("comentario-item");

        const encabezado = document.createElement("p");
        encabezado.classList.add("comentario-encabezado");
        encabezado.textContent = `${comentario.nombre} · ${comentario.fecha}`;

        const texto = document.createElement("p");
        texto.classList.add("comentario-texto");
        texto.textContent = comentario.texto;

        item.appendChild(encabezado);
        item.appendChild(texto);
        contenedor.appendChild(item);
      });
    })
    .catch((error) => {
      mostrarError(tarjeta, error.message);
    });
}

function validarComentario(nombre, texto) {
  if (nombre.length < 3) {
    return "El nombre debe tener al menos 3 caracteres.";
  }
  if (nombre.length > 80) {
    return "El nombre no puede superar los 80 caracteres.";
  }
  if (texto.length < 5) {
    return "El comentario debe tener al menos 5 caracteres.";
  }
  if (texto.length > 300) {
    return "El comentario no puede superar los 300 caracteres.";
  }

  return "";
}

function enviarComentario(tarjeta, actividadId, formulario) {
  const nombre = formulario.elements.nombre.value.trim();
  const texto = formulario.elements.texto.value.trim();
  const error = validarComentario(nombre, texto);

  if (error) {
    mostrarError(tarjeta, error);
    return;
  }

  limpiarError(tarjeta);

  fetch(`/api/actividad/${actividadId}/comentarios`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ nombre, texto }),
  })
    .then((response) => {
      return response.json().then((data) => {
        if (!response.ok) {
          throw new Error(data.error || "No se pudo guardar el comentario");
        }
        return data;
      });
    })
    .then(() => {
      formulario.reset();
      cargarComentarios(tarjeta, actividadId);
    })
    .catch((error) => {
      mostrarError(tarjeta, error.message);
    });
}
