from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class Miembro(db.Model):
    __tablename__ = "miembro"

    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(255))
    email = db.Column(db.String(80))
    telefono = db.Column(db.String(15))
    fecha_registro = db.Column(db.DateTime)
    comuna_id = db.Column(db.Integer)

def crear_miembro(nombre, email, telefono):
    nuevo_miembro = Miembro(
        nombre=nombre,
        email=email,
        telefono=telefono,
        fecha_registro=datetime.now(),
        comuna_id=10301
    )

    db.session.add(nuevo_miembro)
    db.session.commit()