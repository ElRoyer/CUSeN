from fastapi import FastAPI
from fastapi.responses import HTMLResponse  # Importación requerida
from fastapi.middleware.cors import CORSMiddleware
import psycopg2
import os

app = FastAPI()
def get_db():
    try:
        conn = psycopg2.connect(
            host=os.getenv("DB_HOST"),
            database=os.getenv("DB_NAME"),
            user=os.getenv("DB_USER"),
            password=os.getenv("DB_PASSWORD"),
            sslmode="require",  # Obligatorio para Neon
            connect_timeout=5  # Opcional: tiempo de espera
        )
        return conn
    except Exception as e:
        print(f"Error de conexión: {e}")
        raise

@app.get("/", response_class=HTMLResponse)
async def read_root():
    return """
    <html>
        <head><title>API Trabajadores</title></head>
        <body>
            <h1>API de Trabajadores</h1>
            <p>Endpoints disponibles:</p>
            <ul>
                <li><a href="/trabajadores">/trabajadores</a> - Lista todos</li>
                <li><a href="/trabajadores?nombre=Juan">/trabajadores?nombre=Juan</a> - Busca por nombre</li>
            </ul>
        </body>
    </html>
    """


@app.get("/trabajadores")
async def listar_trabajadores(nombre: str = None):
    try:
        conn = get_db()
        cursor = conn.cursor()
        
        if nombre:
            cursor.execute("SELECT * FROM trabajadores WHERE nombre LIKE %s", (f"%{nombre}%",))
        else:
            cursor.execute("SELECT * FROM trabajadores")
            
        column_names = [desc[0] for desc in cursor.description]
        resultados = [dict(zip(column_names, row)) for row in cursor.fetchall()]
        
        return {"data": resultados}
    except Exception as e:
        return {"error": str(e)}, 500
    finally:
        if 'conn' in locals():
            conn.close()
