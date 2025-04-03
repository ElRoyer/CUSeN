const API_URL = "https://cusen-production.up.railway.app";

// Espera a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
  // Cargar todos los trabajadores al inicio
  cargarTodosLosTrabajadores();


  // Conexión con el formulario - VERSIÓN CORREGIDA
   // Manejar búsqueda
   document.getElementById('buscador').addEventListener('submit', function(e) {
    e.preventDefault();
    const nombre = document.getElementById('nombre-busqueda').value.trim();
    if (nombre) {
      buscarTrabajadores(nombre);
    }
  });
});

//Mostrar todos los Registros de Trabajadores
async function cargarTodosLosTrabajadores() {
  try {
    const response = await fetch(`${API_URL}/trabajadores`);
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
    const response = await fetch(`${API_URL}/trabajadores?nombre=${encodeURIComponent(nombre)}`);
    const data = await response.json();
    mostrarListaBasica(data.data || data);
  } catch (error) {
    console.error("Error:", error);
    mostrarError("No se encontraron resultados");
  }
}


function mostrarListaBasica(trabajadores) {
  const resultadosDiv = document.getElementById('resultados');
  resultadosDiv.innerHTML = '';

  if (!trabajadores || trabajadores.length === 0) {
    resultadosDiv.innerHTML = '<p class="no-resultados">No se encontraron trabajadores</p>';
    return;
  }

  trabajadores.forEach(trabajador => {
    const trabajadorElement = document.createElement('div');
    trabajadorElement.className = 'trabajador-basico';
    trabajadorElement.innerHTML = `
      <div class="info-basica">
        <h3>${trabajador.nombre}</h3>
        <p><strong>Departamento:</strong> ${trabajador.departamento || 'No especificado'}</p>
      </div>
      <div class="info-completa" style="display:none;">
        <p><strong>Puesto:</strong> ${trabajador.puesto || 'No especificado'}</p>
        <p><strong>Salario:</strong> ${trabajador.salario || 'No especificado'}</p>
        <p><strong>Fecha Contratación:</strong> ${trabajador.fecha_contratacion || 'No especificado'}</p>
        <p><strong>Teléfono:</strong> ${trabajador.telefono || 'No especificado'}</p>
        <p><strong>Email:</strong> ${trabajador.email || 'No especificado'}</p>
        <p><strong>Dirección:</strong> ${trabajador.direccion || 'No especificado'}</p>
      </div>
    `;
    
    // Agregar evento de clic
    trabajadorElement.querySelector('.info-basica').addEventListener('click', function() {
      const infoCompleta = this.nextElementSibling;
      infoCompleta.style.display = infoCompleta.style.display === 'none' ? 'block' : 'none';
    });

    resultadosDiv.appendChild(trabajadorElement);
  });
}

function mostrarError(mensaje) {
  document.getElementById('resultados').innerHTML = `
    <p class="error-mensaje">${mensaje}</p>
  `;
}
