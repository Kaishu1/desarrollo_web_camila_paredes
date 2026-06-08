from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class Region(db.Model):
    __tablename__ = "region"

    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(200), nullable=False)

class Comuna(db.Model):
    __tablename__ = "comuna"

    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(200), nullable=False)
    region_id = db.Column(db.Integer, db.ForeignKey("region.id"), nullable=False)

class Miembro(db.Model):
    __tablename__ = "miembro"

    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(80), nullable=False)
    telefono = db.Column(db.String(15), nullable=False)
    fecha_registro = db.Column(db.DateTime, nullable=False)
    comuna_id = db.Column(db.Integer, db.ForeignKey("comuna.id"), nullable=False)

class Actividad(db.Model):
    __tablename__ = "actividad"

    id = db.Column(db.Integer, primary_key=True)
    miembro_id = db.Column(db.Integer, db.ForeignKey("miembro.id"), nullable=False)
    dia = db.Column(db.Enum(
        "lunes",
        "martes",
        "miércoles",
        "jueves",
        "viernes",
        "sábado",
        "domingo",
    ), nullable=False)
    hora_inicio = db.Column(db.String(5), nullable=False)
    duracion = db.Column(db.String(5), nullable=False)
    tipo = db.Column(db.Enum(
        "arte",
        "deporte",
        "tecnología",
        "social",
        "recreación",
        "otra",
    ), nullable=False)
    nombre = db.Column(db.String(45), nullable=False)
    descripcion = db.Column(db.Text)

class Foto(db.Model):
    __tablename__ = "foto"

    id = db.Column(db.Integer, primary_key=True)
    ruta_archivo = db.Column(db.String(300), nullable=False)
    nombre_archivo = db.Column(db.String(300), nullable=False)
    actividad_id = db.Column(db.Integer, db.ForeignKey("actividad.id"), nullable=False)

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

def asegurar_comuna_prueba():
    if Comuna.query.get(10301):
        return

    if not Region.query.get(13):
        db.session.add(Region(id=13, nombre="Región de prueba"))
        db.session.flush()

    db.session.add(Comuna(id=10301, nombre="Comuna de prueba", region_id=13))
    db.session.flush()

def crear_registro_completo(
    nombre,
    email,
    telefono,
    comuna_id,
    nombre_actividad,
    tipo_actividad,
    dia,
    hora_inicio,
    duracion,
    descripcion,
    ruta_foto=None,
    nombre_foto=None,
):
    asegurar_comuna_prueba()

    nuevo_miembro = Miembro(
        nombre=nombre,
        email=email,
        telefono=telefono,
        fecha_registro=datetime.now(),
        comuna_id=comuna_id,
    )
    db.session.add(nuevo_miembro)
    db.session.flush()

    nueva_actividad = Actividad(
        miembro_id=nuevo_miembro.id,
        dia=dia,
        hora_inicio=hora_inicio,
        duracion=duracion,
        tipo=tipo_actividad,
        nombre=nombre_actividad,
        descripcion=descripcion,
    )
    db.session.add(nueva_actividad)
    db.session.flush()

    if ruta_foto and nombre_foto:
        nueva_foto = Foto(
            ruta_archivo=ruta_foto,
            nombre_archivo=nombre_foto,
            actividad_id=nueva_actividad.id,
        )
        db.session.add(nueva_foto)

    db.session.commit()
