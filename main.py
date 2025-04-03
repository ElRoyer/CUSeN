from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import psycopg2
import os

app = FastAPI()

# Configuración CORS más completa
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://elroyer.github.io", "http://localhost"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"]
)

# Conexión a la base de datos con manejo de errores
def get_db():
    try:
        conn = psycopg2.connect(
            host="ep-twilight-tooth-aSe8quti-pooler.us-east-2.aws.neon.tech",
            database="neondo",
            user="neondo_owner",
            password="npg_lCx9fzJ0ogct",
            sslmode="require"
        )
        return conn
    except Exception as e:
        print(f"Error de conexión a DB: {e}")
        raise

@app.get("/")
async def root():
    return {"message": "API de Trabajadores funcionando"}

@app.get("/trabajadores")
async def buscar_trabajador(nombre: str = ""):
    try:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM trabajadores WHERE nombre LIKE %s", (f"%{nombre}%",))
        resultados = cursor.fetchall()
        
        # Convertir a formato JSON serializable
        column_names = [desc[0] for desc in cursor.description]
        trabajadores = [dict(zip(column_names, row)) for row in resultados]
        
        return {"data": trabajadores}
    except Exception as e:
        print(f"Error en endpoint: {e}")
        return {"error": str(e)}, 500
    finally:
        if 'conn' in locals():
            conn.close()
