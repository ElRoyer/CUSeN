from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import psycopg2
import os
from datetime import date
from datetime import date, datetime  # Añade estos imports
from fastapi import FastAPI, HTTPException, Query  # Añade Query a los imports

app = FastAPI()

# Configuración CORS (permite frontend en GitHub Pages)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://elroyer.github.io", "http://localhost"],  # Reemplaza con tu usuario GitHub
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"]
)

# Conexión a Neon con manejo de errores
def get_db():
    try:
        conn = psycopg2.connect(
            host=os.getenv("DB_HOST", "ep-twilight-tooth-a5e8qut1-pooler.us-east-2.aws.neon.tech"),
            database=os.getenv("DB_NAME", "neondb"),
            user=os.getenv("DB_USER", "neondb_owner"),
            password=os.getenv("DB_PASSWORD", "npg_TBmrah2d5gJL"),  # Reemplaza con tu contraseña real
            sslmode="require",
            connect_timeout=5
        )
        return conn
    except Exception as e:
        print(f"❌ Error de conexión: {e}")
        raise HTTPException(status_code=500, detail=f"Error de base de datos: {str(e)}")

@app.get("/")
async def root():
    return {"message": "API de Trabajadores operativa", "status": "OK"}

@app.get("/trabajador")
async def listar_trabajadores(nombre: str = None,
                              page: int = Query(1, ge=1, description="Número de página"),
                              per_page: int = Query(20, ge=1, le=100, description="Items por página")):
    conn = None
    try:
        conn = get_db()
        cursor = conn.cursor()
        
        query = """
            SELECT 
                id, nombre_completo, division, horario, 
                telefono, correo, contacto_emergencia, puesto, tipo_trabajador
            FROM trabajador
        """
        
         # Consulta para contar el total
        count_query = "SELECT COUNT(*) FROM trabajador"
        params = ()
        filter_conditions = []
        
        if nombre:
            filter_conditions.append("nombre_completo ILIKE %s")
            params = (f"%{nombre}%",)

           # Aplicar filtros si existen
        if filter_conditions:
            where_clause = " WHERE " + " AND ".join(filter_conditions)
            base_query += where_clause
            count_query += where_clause

        query += " ORDER BY nombre_completo ASC"  # Orden alfabético    

         # Paginación
        offset = (page - 1) * per_page
        base_query += " LIMIT %s OFFSET %s"
        params += (per_page, offset)

        cursor.execute(query, params)
        column_names = [desc[0] for desc in cursor.description]
         # Función para convertir objetos date/datetime a string
        def convert_value(value):
            if isinstance(value, (date, datetime)):
                return value.isoformat()
            return value
        
        resultados = [
            dict(zip(column_names, row))
            for row in cursor.fetchall()
        ]
        
        return {"data": resultados, "count": len(resultados)}
    
    except Exception as e:
        print(f"Error en la consulta: {e}")  # Log detallado
        raise HTTPException(
            status_code=500,
            detail=f"Error al consultar la base de datos: {str(e)}"
        )
    finally:
        if conn:
            conn.close()

@app.get("/trabajador/{id}")
async def obtener_trabajador(id: int):
    conn = None
    try:
        conn = get_db()
        cursor = conn.cursor()
        
        cursor.execute("""
            SELECT * FROM trabajador WHERE id = %s
        """, (id,))
        
        result = cursor.fetchone()
        if not result:
            raise HTTPException(status_code=404, detail="Trabajador no encontrado")
            
        column_names = [desc[0] for desc in cursor.description]
        return JSONResponse({"data": dict(zip(column_names, result))})
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if conn:
            conn.close()
