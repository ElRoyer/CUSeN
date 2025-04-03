from fastapi import FastAPI
from fastapi.responses import JSONResponse
import psycopg2
import os

app = FastAPI()

# Conexión a Neon - ¡Versión definitiva!
def get_db():
    try:
        conn = psycopg2.connect(
            host="ep-twilight-tooth-aSe8quti-pooler.us-east-2.aws.neon.tech",  # TU host real
            database="neondo",
            user="neondo_owner",
            password="tu_contraseña_real",  # La misma que usas en el SQL Editor de Neon
            sslmode="require"  # Obligatorio
        )
        return conn
    except Exception as e:
        print(f"🔥 Error de conexión: {e}")
        raise

@app.get("/trabajadores")
async def listar_trabajadores(nombre: str = None):
    try:
        conn = get_db()
        cursor = conn.cursor()
        
        if nombre:
            cursor.execute("""
                SELECT id, nombre, puesto, departamento, salario 
                FROM public.trabajadores 
                WHERE nombre LIKE %s
            """, (f"%{nombre}%",))
        else:
            cursor.execute("""
                SELECT id, nombre, puesto, departamento, salario 
                FROM public.trabajadores
            """)
        
        # Convertir a JSON
        column_names = [desc[0] for desc in cursor.description]
        resultados = [dict(zip(column_names, row)) for row in cursor.fetchall()]
        
        return {"data": resultados}
    
    except Exception as e:
        return {"error": str(e)}, 500
        
    finally:
        if 'conn' in locals():
            conn.close()
            
@app.get("/")
async def root():
    return {"message": "API de Trabajadores funcionando"}
