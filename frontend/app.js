// URL de tu API en Railway
const API_URL = "https://cusen-production.up.railway.app";

// Función para buscar trabajadores
async function buscarTrabajadores(nombre) {
  try {
    const response = await fetch(`${API_URL}/trabajadores?nombre=${encodeURIComponent(nombre)}`);
    
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const data = await response.json();
    mostrarResultados(data);
  } catch (error) {
    console.error("Error al buscar trabajadores:", error);
    mostrarError("No se pudieron cargar los datos. Intenta más tarde.");
  }
}

// Función para mostrar resultados en el HTML
function mostrarResultados(trabajadores) {
  const resultadosDiv = document.getElementById("resultados");
  resultadosDiv.innerHTML = "";

  if (trabajadores.length === 0) {
    resultadosDiv.innerHTML = "<p>No se encontraron trabajadores.</p>";
    return;
  }

  trabajadores.forEach(trabajador => {
    const trabajadorDiv = document.createElement("div");
    trabajadorDiv.className = "trabajador";
    trabajadorDiv.innerHTML = `
      <h3>${trabajador.nombre}</h3>
      <p><strong>Puesto:</strong> ${trabajador.puesto}</p>
      <p><strong>Departamento:</strong> ${trabajador.departamento}</p>
      <p><strong>Salario:</strong> $${trabajador.salario?.toFixed(2) || 'N/A'}</p>
    `;
    resultadosDiv.appendChild(trabajadorDiv);
  });
}

// Función para manejar errores
function mostrarError(mensaje) {
  const resultadosDiv = document.getElementById("resultados");
  resultadosDiv.innerHTML = `<p class="error">${mensaje}</p>`;
}

// Evento al cargar la página
document.addEventListener("DOMContentLoaded", () => {
  const buscadorForm = document.getElementById("buscador");
  
  buscadorForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const nombre = document.getElementById("nombre-busqueda").value.trim();
    if (nombre) buscarTrabajadores(nombre);
  });
});
