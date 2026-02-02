import firebase_admin
from firebase_admin import credentials, messaging, firestore
from datetime import datetime
import os
import json

# Leer la clave desde la variable de entorno de GitHub
key_dict = json.loads(os.environ.get('FIREBASE_KEY'))
cred = credentials.Certificate(key_dict)
firebase_admin.initialize_app(cred)
db = firestore.client()

def buscar_y_notificar():
    # Obtener fecha actual en formato -MM-DD (ej: -05-20)
    hoy = datetime.now().strftime("-%m-%d")
    print(f"Buscando cumpleañeros para: {hoy}")
    
    # Ruta de tu colección según tus archivos
    alumnos_ref = db.collection('artifacts/default-app-id/public/data/alumni')
    alumnos = alumnos_ref.stream()
    
    cumpleañeros = []
    for a in alumnos:
        data = a.to_dict()
        fecha = data.get('fechaNacimiento', '')
        if fecha and fecha.endswith(hoy):
            cumpleañeros.append(f"{data.get('nombre')} {data.get('apellidos')}")

    if not cumpleañeros:
        print("Hoy no hay cumpleaños.")
        return

    # Obtener tokens de suscritos
    tokens_docs = db.collection('suscripciones').stream()
    tokens = [t.to_dict().get('token') for t in tokens_docs if t.to_dict().get('token')]

    if tokens:
        mensaje = messaging.MulticastMessage(
            notification=messaging.Notification(
                title="🎂 ¡Cumpleaños en la Orla!",
                body=f"Hoy es el cumple de: {', '.join(cumpleañeros)}. ¡Entra a felicitarles!",
            ),
            tokens=tokens,
        )
        response = messaging.send_each_for_multicast(mensaje)
        print(f"Enviado con éxito a {response.success_count} dispositivos.")
    else:
        print("Hay cumples, pero no hay suscriptores.")

if __name__ == "__main__":
    buscar_y_notificar()
