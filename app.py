import os
from uuid import uuid4

from flask import Flask, render_template, request, redirect, url_for
from werkzeug.utils import secure_filename

from database.db import Actividad, Comuna, Foto, db, Miembro, crear_registro_completo

app = Flask(__name__)

app.config["SQLALCHEMY_DATABASE_URI"] = "mysql+pymysql://cc5002:programacionweb@localhost:3306/tarea2"

app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["UPLOAD_FOLDER"] = os.path.join(app.root_path, "static", "uploads")

db.init_app(app)

@app.route("/")
@app.route("/index")
def index():
    ultimos_miembros = Miembro.query.order_by(
        Miembro.fecha_registro.desc()
    ).limit(5).all()

    return render_template("index.html", miembros=ultimos_miembros)

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

    actividades_ids = [actividad.id for actividad in actividades]
    fotos_por_actividad = {}

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

@app.route("/registro-miembros", methods=["GET", "POST"])
def registroMiembros():
    if request.method == "POST":
        nombre = request.form["nombre"]
        email = request.form["correo"]
        telefono = request.form["telefono"]
        comuna_id = int(request.form["comuna"])
        nombre_actividad = request.form["nombreActividad"]
        tipo_actividad = request.form["tipoActividad"]
        dia = request.form["dia"]
        hora_inicio = request.form["horaInicio"]
        duracion = request.form["duracion"]
        descripcion = request.form["descripcion"]

        foto = request.files.get("foto")
        ruta_foto = None
        nombre_foto = None

        if foto and foto.filename:
            os.makedirs(app.config["UPLOAD_FOLDER"], exist_ok=True)
            nombre_foto = secure_filename(foto.filename)
            nombre_guardado = f"{uuid4().hex}_{nombre_foto}"
            ruta_absoluta = os.path.join(app.config["UPLOAD_FOLDER"], nombre_guardado)
            foto.save(ruta_absoluta)
            ruta_foto = f"static/uploads/{nombre_guardado}"

        try:
            crear_registro_completo(
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
                ruta_foto,
                nombre_foto,
            )
        except Exception:
            db.session.rollback()
            raise

        return redirect(url_for("index"))

    exito = request.args.get("exito")
    return render_template("registro-miembros.html", exito=exito)

if __name__ == "__main__":
    app.run(debug=True)
