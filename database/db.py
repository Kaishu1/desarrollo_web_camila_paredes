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
    region_id = db.Column(db.Integer, nullable=False)


class Miembro(db.Model):
    __tablename__ = "miembro"

    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(80), nullable=False)
    telefono = db.Column(db.String(15), nullable=False)
    fecha_registro = db.Column(db.DateTime, nullable=False)
    comuna_id = db.Column("comuna_id", db.Integer, nullable=False)


class Actividad(db.Model):
    __tablename__ = "actividad"

    id = db.Column(db.Integer, primary_key=True)
    miembro_id = db.Column(db.Integer, nullable=False)
    dia = db.Column(db.String(20), nullable=False)
    hora_inicio = db.Column(db.String(5), nullable=False)
    duracion = db.Column(db.String(5), nullable=False)
    tipo = db.Column(db.String(50), nullable=False)
    nombre = db.Column(db.String(45), nullable=False)
    descripcion = db.Column(db.Text, nullable=True)


class Foto(db.Model):
    __tablename__ = "foto"

    id = db.Column(db.Integer, primary_key=True)
    ruta_archivo = db.Column(db.String(300), nullable=False)
    nombre_archivo = db.Column(db.String(300), nullable=False)
    actividad_id = db.Column(db.Integer, nullable=False)


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
    ruta_archivo=None,
    nombre_archivo=None
):
    nuevo_miembro = Miembro(
        nombre=nombre,
        email=email,
        telefono=telefono,
        fecha_registro=datetime.now(),
        comuna_id=comuna_id
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
        descripcion=descripcion
    )

    db.session.add(nueva_actividad)
    db.session.flush()

    if ruta_archivo and nombre_archivo:
        nueva_foto = Foto(
            ruta_archivo=ruta_archivo,
            nombre_archivo=nombre_archivo,
            actividad_id=nueva_actividad.id
        )
        db.session.add(nueva_foto)

    db.session.commit()
