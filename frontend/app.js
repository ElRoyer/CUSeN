const API_URL = "https://cusen-production.up.railway.app";

async function buscarTrabajadores(nombre) {
  try {
    const response = await fetch(`${API_URL}/trabajadores?nombre=${encodeURIComponent(nombre)}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Error HTTP: ${response.status}`);
    }

    const data = await response.json();
    mostrarResultados(data.data); // Ajusta según la estructura de tu respuesta
  } catch (error) {
    console.error("Error al buscar trabajadores:", error);
    mostrarError(error.message || "No se pudieron cargar los datos. Intenta más tarde.");
  }
}
