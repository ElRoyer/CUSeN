const API_URL = "https://cusen-production.up.railway.app";
let debounceTimer = null;

// Espera a que el DOM esté completamente cargado
document.addEventListener("DOMContentLoaded", function () {
  cargarTrabajadores(); // Carga inicial

   // Autocompletado en tiempo real
   document.getElementById("nombre-busqueda").addEventListener("input", function () {
    const nombre = this.value.trim();
    clearTimeout(debounceTimer);

    debounceTimer = setTimeout(() => {
      cargarTrabajadores(nombre);
    }, 300); // Espera 300ms después de que el usuario deje de escribir
  });
});

// Cargar trabajadores (todos o por nombre)
async function cargarTrabajadores( nombre = "") {
  try {
    let url = `${API_URL}/trabajador`;
    if (nombre) {
      url += `?nombre=${encodeURIComponent(nombre)}`;
    }

    const response = await fetch(url);
    const data = await response.json();
    mostrarListaBasica(data.data || []); // Asegura que sea un array
  } catch (error) {
    console.error("Error:", error);
    mostrarError("No se pudieron cargar los trabajadores");
  }
}

function mostrarListaBasica(trabajadores) {
  const resultadosDiv = document.getElementById("resultados");
  resultadosDiv.innerHTML = "";

  if (!trabajadores || trabajadores.length === 0) {
    resultadosDiv.innerHTML = '<p class="no-resultados">No se encontraron trabajadores</p>';
    return;
  }

  trabajadores.forEach((trabajador) => {
    const card = document.createElement("div");
    card.className = "trabajador-card";

    card.innerHTML = `
      <div class="card-header">
        <h3>${trabajador.nombre_completo} - ${trabajador.puesto}</h3>
        <span class="toggle-icon">▼</span>
      </div>
      <div class="card-content" style="display: none;">
        ${crearInfoRow("Tipo de Trabajador", trabajador.tipo_trabajador)}
        ${crearInfoRow("Equipo", trabajador.division)}
        ${crearInfoRow("Horario", trabajador.horario)}
        ${crearInfoRow("Teléfono", trabajador.telefono)}
        ${crearInfoRow("Correo", trabajador.correo)}
        ${crearInfoRow("Contacto Emergencia", trabajador.contacto_emergencia)}
      </div>
    `;

    card.querySelector(".card-header").addEventListener("click", function () {
      const content = this.nextElementSibling;
      const icon = this.querySelector(".toggle-icon");
      const visible = content.style.display === "block";
      content.style.display = visible ? "none" : "block";
      icon.style.transform = visible ? "rotate(0deg)" : "rotate(180deg)";
      icon.style.color = visible ? "var(--medium-gray)" : "var(--accent-color)";
      card.classList.toggle("active", !visible);
    });

    resultadosDiv.appendChild(card);
  });
}

function crearInfoRow(label, value) {
  return `
    <div class="info-row">
      <span class="info-label">${label}:</span>
      <span class="info-value">${value || "No especificado"}</span>
    </div>
  `;
}

function mostrarError(mensaje) {
  document.getElementById("resultados").innerHTML = `<p class="error-mensaje">${mensaje}</p>`;
}
