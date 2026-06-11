from flask import Flask, jsonify, render_template, request, redirect, url_for
from database.db import Actividad, Comuna, Foto, Region, db, Miembro, crear_registro_completo
from werkzeug.utils import secure_filename
import os

app = Flask(__name__)

app.config["SQLALCHEMY_DATABASE_URI"] = "mysql+pymysql://cc5002:programacionweb@localhost:3306/tarea2"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

UPLOAD_FOLDER = "static/uploads"
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

db.init_app(app)
# r u t a s 


def obtener_regiones():
    return Region.query.order_by(Region.id).all()


@app.route("/")
@app.route("/index")
def index():

    ultimos_miembros = Miembro.query.order_by(
        Miembro.fecha_registro.desc()
    ).limit(5).all()

    return render_template("index.html",miembros=ultimos_miembros)


@app.route("/estadisticas")
def estadisticas():
    return render_template("estadisticas.html")

@app.route("/listado-actividades")
def listadoActividades():
    return render_template("listado-actividades.html")


@app.route("/listado-miembros")
def listadoMiembros():
    tipo_actividad = request.args.get("tipoActividad", "todos")
    pagina = request.args.get("pagina", 1, type=int)
    por_pagina = 5

    if pagina < 1:
        pagina = 1

    consulta = db.session.query(
        Miembro,
        Actividad,
        Foto,
        Comuna,
    ).outerjoin(
        Actividad,
        Actividad.miembro_id == Miembro.id,
    ).outerjoin(
        Foto,
        Foto.actividad_id == Actividad.id,
    ).outerjoin(
        Comuna,
        Comuna.id == Miembro.comuna_id,
    )

    if tipo_actividad != "todos":
        consulta = consulta.filter(Actividad.tipo == tipo_actividad)

    consulta = consulta.order_by(
        Miembro.fecha_registro.desc(),
        Actividad.id.desc(),
        Foto.id.desc(),
    )

    total_registros = consulta.count()
    total_paginas = (total_registros + por_pagina - 1) // por_pagina

    if total_paginas > 0 and pagina > total_paginas:
        pagina = total_paginas

    registros = consulta.limit(por_pagina).offset((pagina - 1) * por_pagina).all()

    return render_template(
        "listado-miembros.html",
        registros=registros,
        tipo_seleccionado=tipo_actividad,
        pagina=pagina,
        total_paginas=total_paginas,
    )


@app.route("/detalle-miembro/<int:miembro_id>")
def detalleMiembro(miembro_id):
    miembro = Miembro.query.get_or_404(miembro_id)
    comuna = Comuna.query.get(miembro.comuna_id)
    actividades = Actividad.query.filter_by(miembro_id=miembro.id).order_by(
        Actividad.id.desc()
    ).all()

    fotos_por_actividad = {}
    actividades_ids = [actividad.id for actividad in actividades]

    if actividades_ids:
        fotos = Foto.query.filter(Foto.actividad_id.in_(actividades_ids)).all()
        for foto in fotos:
            fotos_por_actividad.setdefault(foto.actividad_id, []).append(foto)

    return render_template(
        "detalle-miembro.html",
        miembro=miembro,
        comuna=comuna,
        actividades=actividades,
        fotos_por_actividad=fotos_por_actividad,
    )


@app.route("/comunas/<int:region_id>")
def comunasPorRegion(region_id):
    comunas = Comuna.query.filter_by(region_id=region_id).order_by(Comuna.nombre).all()

    return jsonify([
        {
            "id": comuna.id,
            "nombre": comuna.nombre,
        }
        for comuna in comunas
    ])


@app.route("/registro-miembros", methods=["GET", "POST"])
def registroMiembros():
    regiones = obtener_regiones()

    if request.method == "POST":
        nombre = request.form.get("nombre")
        email = request.form.get("correo")
        telefono = request.form.get("telefono")
        comuna_id = request.form.get("comuna")

        nombre_actividad = request.form.get("nombreActividad")
        tipo_actividad = request.form.get("tipoActividad")
        dia = request.form.get("dia")
        hora_inicio = request.form.get("horaInicio")
        duracion = request.form.get("duracion")
        descripcion = request.form.get("descripcion")

        # AQUÍ va lo de la foto
        foto = request.files.get("foto")

        ruta_archivo = None
        nombre_archivo = None

        if foto and foto.filename != "":
            nombre_archivo = secure_filename(foto.filename)
            ruta_archivo = os.path.join(app.config["UPLOAD_FOLDER"], nombre_archivo)
            foto.save(ruta_archivo)

        # DESPUÉS se guarda todo en la BD
        crear_registro_completo(
            nombre=nombre,
            email=email,
            telefono=telefono,
            comuna_id=comuna_id,
            nombre_actividad=nombre_actividad,
            tipo_actividad=tipo_actividad,
            dia=dia,
            hora_inicio=hora_inicio,
            duracion=duracion,
            descripcion=descripcion,
            ruta_archivo=ruta_archivo,
            nombre_archivo=nombre_archivo
        )

        return redirect(url_for("index"))

    return render_template("registro-miembros.html", regiones=regiones)

if __name__ == "__main__":
    app.run(debug=True)
