const API_URL = "https://cusen-production.up.railway.app";

// Espera a que el DOM esté completamente cargado
document.addEventListener("DOMContentLoaded", function () {
  // Cargar todos los trabajadores al inicio
  cargarTodosLosTrabajadores();

  // Conexión con el formulario - VERSIÓN CORREGIDA
  // Manejar búsqueda
  document.getElementById("buscador").addEventListener("submit", function (e) {
    e.preventDefault();
    const nombre = document.getElementById("nombre-busqueda").value.trim();
    if (nombre) {
      buscarTrabajadores(nombre);
    }
  });
});

//Mostrar todos los Registros de Trabajadores
async function cargarTodosLosTrabajadores() {
  try {
    const response = await fetch(`${API_URL}/trabajador`);
    const data = await response.json();
    mostrarListaBasica(data.data || data);
  } catch (error) {
    console.error("Error:", error);
    mostrarError("No se pudieron cargar los trabajadores");
  }
}

//Mostrar un trabajador en Especifico
async function buscarTrabajadores(nombre) {
  try {
    const response = await fetch(
      `${API_URL}/trabajador?nombre=${encodeURIComponent(nombre)}`
    );
    const data = await response.json();
    mostrarListaBasica(data.data || data);
  } catch (error) {
    console.error("Error:", error);
    mostrarError("No se encontraron resultados");
  }
}

function mostrarListaBasica(trabajador) {
  const resultadosDiv = document.getElementById("resultados");
  resultadosDiv.innerHTML = "";

  if (!trabajador || trabajador.length === 0) {
    resultadosDiv.innerHTML =
      '<p class="no-resultados">No se encontraron trabajadores</p>';
    return;
  }

  trabajador.forEach((trabajador) => {
    const trabajadorElement = document.createElement("div");
    trabajadorElement.className = "trabajador-card"; // Cambiado a trabajador-card para consistencia

    trabajadorElement.innerHTML = `
    <div class="card-header">
      <h3>${trabajador.nombre_completo} - ${trabajador.puesto}</h3>
      <span class="toggle-icon">▼</span>
    </div>
    <div class="card-content" style="display: none;">
      <div class="info-row">
        <span class="info-label">Tipo de Trabajador:</span>
        <span class="info-value">${
          trabajador.tipo_trabajador || "No especificado"
        }</span>
      </div>
      <div class="info-row">
        <span class="info-label">Equipo:</span>
        <span class="info-value">${
          trabajador.division || "No especificado"
        }</span>
      </div>
      <div class="info-row">
        <span class="info-label">Horario:</span>
        <span class="info-value">${
          trabajador.horario || "No especificado"
        }</span>
      </div>
      <div class="info-row">
        <span class="info-label">Teléfono:</span>
        <span class="info-value">${
          trabajador.telefono || "No especificado"
        }</span>
      </div>
      <div class="info-row">
        <span class="info-label">Correo:</span>
        <span class="info-value">${
          trabajador.correo || "No especificado"
        }</span>
      </div>
      <div class="info-row">
        <span class="info-label">Contacto Emergencia:</span>
        <span class="info-value">${
          trabajador.contacto_emergencia || "No especificado"
        }</span>
      </div>
    </div>
  `;

    // Agregar evento de clic mejorado
    trabajadorElement
      .querySelector(".card-header")
      .addEventListener("click", function () {
        const cardContent = this.nextElementSibling;
        const isHidden = cardContent.style.display === "none";

        // Alternar visibilidad
        cardContent.style.display = isHidden ? "block" : "none";

        // Rotar ícono
        const icon = this.querySelector(".toggle-icon");
        icon.style.transform = isHidden ? "rotate(180deg)" : "rotate(0)";
        icon.style.color = isHidden
          ? "var(--accent-color)"
          : "var(--medium-gray)";

        // Alternar clase active para estilos adicionales
        trabajadorElement.classList.toggle("active", isHidden);
      });

    resultadosDiv.appendChild(trabajadorElement);
  });
}

function mostrarError(mensaje) {
  document.getElementById("resultados").innerHTML = `
    <p class="error-mensaje">${mensaje}</p>
  `;
}
