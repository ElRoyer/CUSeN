const API_URL = "https://cusen-production.up.railway.app";

// Espera a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
  // Conexión con el formulario - VERSIÓN CORREGIDA
  document.getElementById('buscador').addEventListener('submit', function(e) {
    e.preventDefault(); // Esto evita la recarga de página
    
    const nombre = document.getElementById('nombre-busqueda').value.trim();
    console.log("Buscando:", nombre); // Para depuración
    
    if (nombre) {
      buscarTrabajadores(nombre);
    } else {
      mostrarError("Por favor ingresa un nombre para buscar");
    }
  });
});

async function buscarTrabajadores(nombre) {
  try {
    console.log("Iniciando búsqueda..."); // Depuración
    const response = await fetch(`${API_URL}/trabajadores?nombre=${encodeURIComponent(nombre)}`);
    
    console.log("Respuesta recibida:", response); // Depuración
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || `Error HTTP: ${response.status}`);
    }

    const data = await response.json();
    console.log("Datos recibidos:", data); // Depuración
    mostrarResultados(data.data || data);
  } catch (error) {
    console.error("Error completo:", error); // Depuración detallada
    mostrarError(error.message || "No se pudieron cargar los datos. Intenta más tarde.");
  }
}

function mostrarResultados(trabajadores) {
  const resultadosDiv = document.getElementById('resultados');
  
  if (!trabajadores || trabajadores.length === 0) {
    resultadosDiv.innerHTML = '<p class="no-resultados">No se encontraron trabajadores con ese nombre</p>';
    return;
  }
  
  resultadosDiv.innerHTML = trabajadores.map(t => `
    <div class="trabajador-card">
      <h3>${t.nombre}</h3>
      <p><strong>Puesto:</strong> ${t.puesto || 'No especificado'}</p>
      <p><strong>Departamento:</strong> ${t.departamento || 'No especificado'}</p>
    </div>
  `).join('');
}

function mostrarError(mensaje) {
  document.getElementById('resultados').innerHTML = `
    <p class="error-mensaje">${mensaje}</p>
  `;
}
