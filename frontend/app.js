const API_URL = "https://cusen-production.up.railway.app";
let currentPage = 1;
let isLoading = false;
let allLoaded = false;
let currentTrabajadores = [];
let currentSearchTerm = '';
const trabajadoresIds = new Set(); // Para evitar duplicados

// Espera a que el DOM esté completamente cargado
document.addEventListener("DOMContentLoaded", function () {
  cargarMasTrabajadores(); // Solo esta llamada

  window.addEventListener('scroll', function() {
    if (isNearBottom() && !isLoading && !allLoaded) {
      cargarMasTrabajadores();
    }
  });

  document.getElementById("buscador").addEventListener("submit", function (e) {
    e.preventDefault();
    const nombre = document.getElementById("nombre-busqueda").value.trim();
    currentSearchTerm = nombre;
    resetearLista();
  });
});

async function cargarMasTrabajadores() {
  if (isLoading || allLoaded) return;
  
  isLoading = true;
  document.getElementById('loading').style.display = 'block';

  try {
    const url = currentSearchTerm 
      ? `${API_URL}/trabajador?nombre=${encodeURIComponent(currentSearchTerm)}&page=${currentPage}`
      : `${API_URL}/trabajador?page=${currentPage}`;

    const response = await fetch(url);
    const data = await response.json();
    
    if (data.data.length === 0) {
      allLoaded = true;
      document.getElementById('loading').style.display = 'none';
      return;
    }

    // Filtrar duplicados
    const nuevosTrabajadores = data.data.filter(t => !trabajadoresIds.has(t.id));
    nuevosTrabajadores.forEach(t => trabajadoresIds.add(t.id));
    
    currentTrabajadores = [...currentTrabajadores, ...nuevosTrabajadores];
    mostrarListaBasica(currentTrabajadores);
    currentPage++;
    
  } catch (error) {
    console.error("Error:", error);
  } finally {
    isLoading = false;
    document.getElementById('loading').style.display = 'none';
  }
}

function resetearLista() {
  currentPage = 1;
  allLoaded = false;
  currentTrabajadores = [];
  trabajadoresIds.clear();
  document.getElementById("resultados").innerHTML = '';
  cargarMasTrabajadores();
}

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
    currentTrabajadores = data.data || data;
    mostrarListaBasica(currentTrabajadores);
  } catch (error) {
    console.error("Error:", error);
    mostrarError("No se encontraron resultados");
  }
}

function resetearLista() {
  currentPage = 1;
  allLoaded = false;
  currentTrabajadores = [];
  cargarMasTrabajadores();
}

function mostrarListaBasica(trabajador) {
  const resultadosDiv = document.getElementById("resultados");
  resultadosDiv.innerHTML = "";

  // Solo limpia si es una nueva búsqueda o reset
  if (currentPage === 1) {
    resultadosDiv.innerHTML = '';
  }
  
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
