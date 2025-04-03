const API_URL = "https://cusen-production.up.railway.app";

// Conexión con el formulario
document.getElementById('buscador').addEventListener('submit', async (e) => {
  e.preventDefault(); // Evita que el formulario recargue la página
  const nombre = document.getElementById('nombre-busqueda').value.trim();
  
  if (nombre) {
    await buscarTrabajadores(nombre);
  } else {
    mostrarError("Por favor ingresa un nombre para buscar");
  }
});

async function buscarTrabajadores(nombre) {
  try {
    const response = await fetch(`${API_URL}/trabajadores?nombre=${encodeURIComponent(nombre)}`);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || `Error HTTP: ${response.status}`);
    }

    const data = await response.json();
    mostrarResultados(data.data || data); // Adaptable según la estructura de tu API
  } catch (error) {
    console.error("Error al buscar trabajadores:", error);
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
      <p><strong>Puesto:</strong> ${t.puesto || 'No especificado
