import psycopg2
import os
from fastapi import FastAPI

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

@app.get("/trabajadores")
async def buscar_trabajadores(nombre: str = ""):
    try:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM trabajadores WHERE nombre LIKE %s", (f"%{nombre}%",))
        column_names = [desc[0] for desc in cursor.description]
        resultados = [dict(zip(column_names, row)) for row in cursor.fetchall()]
        return {"data": resultados}
    except Exception as e:
        return {"error": str(e)}, 500
    finally:
        if 'conn' in locals():
            conn.close()
