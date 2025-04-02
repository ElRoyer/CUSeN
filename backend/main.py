from fastapi import FastAPI  
from fastapi.middleware.cors import CORSMiddleware  
import psycopg2  

app = FastAPI()  

# Permite CORS para GitHub Pages  
app.add_middleware(  
    CORSMiddleware,  
    allow_origins=["*"],  
    allow_methods=["*"],  
)  

# Conexión a Neon  
def get_db():  
    return psycopg2.connect(  
        host="ep-silent-smoke-123456.us-east-2.aws.neon.tech",  
        database="neondb",  
        user="usuario",  
        password="contraseña",  
    )  

@app.get("/trabajadores")  
def buscar_trabajador(nombre: str = ""):  
    conn = get_db()  
    cursor = conn.cursor()  
    cursor.execute("SELECT * FROM trabajadores WHERE nombre LIKE %s", (f"%{nombre}%",))  
    return cursor.fetchall()  