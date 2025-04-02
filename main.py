from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Lista de orígenes permitidos (agrega tu dominio de GitHub Pages)
origins = [
    "https://elroyer.github.io",  # Reemplaza con tu usuario de GitHub
    "http://localhost",           # Para desarrollo local
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Lista de dominios permitidos
    allow_credentials=True,
    allow_methods=["*"],    # Permite todos los métodos (GET, POST, etc.)
    allow_headers=["*"],    # Permite todos los headers
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
