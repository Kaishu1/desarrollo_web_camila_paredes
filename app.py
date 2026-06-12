from flask import Flask, jsonify, render_template, request, redirect, url_for
from database.db import Actividad, BloqueHorario, Comentario, Comuna, Foto, Region, db, Miembro, crear_registro_completo
from werkzeug.utils import secure_filename
from datetime import datetime
import os

app = Flask(__name__)

app.config["SQLALCHEMY_DATABASE_URI"] = "mysql+pymysql://cc5002:programacionweb@localhost:3306/tarea2"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

UPLOAD_FOLDER = "static/uploads"
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

db.init_app(app)
# r u t a s 


def ruta_static(ruta_archivo):
    ruta = ruta_archivo.replace("\\", "/")

    if ruta.startswith("static/"):
        return ruta.replace("static/", "", 1)

    return ruta


app.jinja_env.filters["ruta_static"] = ruta_static

TIPOS_MIEMBRO = {
    "Estudiante de Pregrado",
    "Estudiante de Postgrado",
    "Funcionario(a)",
    "Académico(a)",
}


def obtener_regiones():
    return Region.query.order_by(Region.id).all()


def obtener_bloques_por_actividad(actividades_ids):
    bloques_por_actividad = {}

    if actividades_ids:
        bloques = BloqueHorario.query.filter(
            BloqueHorario.actividad_id.in_(actividades_ids)
        ).order_by(
            BloqueHorario.dia,
            BloqueHorario.hora_inicio,
        ).all()

        for bloque in bloques:
            bloques_por_actividad.setdefault(bloque.actividad_id, []).append(bloque)

    return bloques_por_actividad


def obtener_bloques_desde_formulario():
    dias = request.form.getlist("bloque_dia[]")
    horas_inicio = request.form.getlist("bloque_hora_inicio[]")
    horas_fin = request.form.getlist("bloque_hora_fin[]")
    bloques_horarios = []
    dias_validos = {"lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo"}

    if not dias or not horas_inicio or not horas_fin:
        raise ValueError("Debe ingresar al menos un bloque horario")
    if not (len(dias) == len(horas_inicio) == len(horas_fin)):
        raise ValueError("Los bloques horarios están incompletos")

    for dia, hora_inicio, hora_fin in zip(dias, horas_inicio, horas_fin):
        dia = dia.strip()
        hora_inicio = hora_inicio.strip()
        hora_fin = hora_fin.strip()

        if not dia or not hora_inicio or not hora_fin:
            raise ValueError("Todos los campos del bloque horario son obligatorios")

        if dia not in dias_validos:
            raise ValueError("El día del bloque horario no es válido")

        inicio = datetime.strptime(hora_inicio, "%H:%M").time()
        fin = datetime.strptime(hora_fin, "%H:%M").time()

        if fin <= inicio:
            raise ValueError("La hora de fin debe ser posterior a la hora de inicio")

        bloques_horarios.append({
            "fecha": datetime(2000, 1, 3).date(),
            "dia": dia,
            "hora_inicio": hora_inicio,
            "hora_fin": hora_fin,
        })

    return bloques_horarios


def duracion_desde_bloques(bloques_horarios):
    total_minutos = 0

    for bloque in bloques_horarios:
        inicio = datetime.strptime(bloque["hora_inicio"], "%H:%M")
        fin = datetime.strptime(bloque["hora_fin"], "%H:%M")
        diferencia = fin - inicio
        total_minutos += int(diferencia.total_seconds() // 60)

    if total_minutos % 60 == 0:
        return str(total_minutos // 60)

    horas = total_minutos / 60
    return str(round(horas, 2)).rstrip("0").rstrip(".")


@app.route("/")
@app.route("/index")
def index():

    ultimos_miembros = db.session.query(
        Miembro,
        Actividad,
    ).outerjoin(
        Actividad,
        Actividad.miembro_id == Miembro.id,
    ).order_by(
        Miembro.fecha_registro.desc()
    ).limit(5).all()

    return render_template("index.html",miembros=ultimos_miembros)


@app.route("/estadisticas")
def estadisticas():
    return render_template("estadisticas.html")


@app.route("/api/estadisticas/miembros-por-dia")
def miembrosPorDia():
    fecha_registro = db.func.date(Miembro.fecha_registro)

    registros = db.session.query(
        fecha_registro.label("dia"),
        db.func.count(Miembro.id).label("cantidad"),
    ).group_by(
        fecha_registro,
    ).order_by(
        fecha_registro,
    ).all()

    return jsonify([
        {
            "dia": dia.strftime("%Y-%m-%d") if hasattr(dia, "strftime") else str(dia),
            "cantidad": int(cantidad),
        }
        for dia, cantidad in registros
    ])


@app.route("/api/estadisticas/actividades-por-tipo")
def actividadesPorTipo():
    registros = db.session.query(
        Actividad.tipo,
        db.func.count(Actividad.id).label("cantidad"),
    ).group_by(
        Actividad.tipo,
    ).order_by(
        Actividad.tipo,
    ).all()

    return jsonify([
        {
            "tipo": tipo,
            "cantidad": int(cantidad),
        }
        for tipo, cantidad in registros
    ])


@app.route("/api/estadisticas/actividades-por-comuna")
def actividadesPorComuna():
    registros = db.session.query(
        Comuna.nombre,
        db.func.count(Actividad.id).label("cantidad"),
    ).select_from(
        Actividad,
    ).join(
        Miembro,
        Actividad.miembro_id == Miembro.id,
    ).join(
        Comuna,
        Miembro.comuna_id == Comuna.id,
    ).group_by(
        Comuna.id,
        Comuna.nombre,
    ).order_by(
        Comuna.nombre,
    ).all()

    return jsonify([
        {
            "comuna": comuna,
            "cantidad": int(cantidad),
        }
        for comuna, cantidad in registros
    ])


@app.route("/listado-actividades")
def listadoActividades():
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
    actividades_ids = [
        actividad.id
        for _, actividad, _, _ in registros
        if actividad
    ]
    bloques_por_actividad = obtener_bloques_por_actividad(actividades_ids)

    return render_template(
        "listado-actividades.html",
        registros=registros,
        bloques_por_actividad=bloques_por_actividad,
        tipo_seleccionado=tipo_actividad,
        pagina=pagina,
        total_paginas=total_paginas,
    )


@app.route("/api/actividad/<int:actividad_id>/comentarios", methods=["GET"])
def obtenerComentariosActividad(actividad_id):
    actividad = Actividad.query.get(actividad_id)

    if not actividad:
        return jsonify({"error": "Actividad no encontrada"}), 404

    comentarios = Comentario.query.filter_by(
        actividad_id=actividad_id
    ).order_by(
        Comentario.fecha.desc()
    ).all()

    return jsonify([
        {
            "id": comentario.id,
            "nombre": comentario.nombre,
            "texto": comentario.texto,
            "fecha": comentario.fecha.strftime("%d-%m-%Y %H:%M"),
        }
        for comentario in comentarios
    ])


@app.route("/api/actividad/<int:actividad_id>/comentarios", methods=["POST"])
def crearComentarioActividad(actividad_id):
    actividad = Actividad.query.get(actividad_id)

    if not actividad:
        return jsonify({"error": "Actividad no encontrada"}), 404

    datos = request.get_json(silent=True) or {}
    nombre = datos.get("nombre", "").strip()
    texto = datos.get("texto", "").strip()

    if len(nombre) < 3:
        return jsonify({"error": "El nombre debe tener al menos 3 caracteres"}), 400
    if len(nombre) > 80:
        return jsonify({"error": "El nombre no puede superar los 80 caracteres"}), 400
    if len(texto) < 5:
        return jsonify({"error": "El comentario debe tener al menos 5 caracteres"}), 400
    if len(texto) > 300:
        return jsonify({"error": "El comentario no puede superar los 300 caracteres"}), 400

    comentario = Comentario(
        nombre=nombre,
        texto=texto,
        fecha=datetime.now(),
        actividad_id=actividad_id,
    )

    db.session.add(comentario)
    db.session.commit()

    return jsonify({"mensaje": "Comentario agregado correctamente"})


@app.route("/listado-miembros")
def listadoMiembros():
    pagina = request.args.get("pagina", 1, type=int)
    por_pagina = 5

    if pagina < 1:
        pagina = 1

    consulta = db.session.query(
        Miembro,
        Comuna,
        Actividad,
    ).select_from(
        Miembro,
    ).outerjoin(
        Comuna,
        Comuna.id == Miembro.comuna_id,
    ).outerjoin(
        Actividad,
        Actividad.miembro_id == Miembro.id,
    ).order_by(
        Miembro.fecha_registro.desc()
    )

    total_registros = consulta.count()
    total_paginas = (total_registros + por_pagina - 1) // por_pagina

    if total_paginas > 0 and pagina > total_paginas:
        pagina = total_paginas

    miembros = consulta.limit(por_pagina).offset((pagina - 1) * por_pagina).all()

    return render_template(
        "listado-miembros.html",
        miembros=miembros,
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
    bloques_por_actividad = obtener_bloques_por_actividad(actividades_ids)

    if actividades_ids:
        fotos = Foto.query.filter(Foto.actividad_id.in_(actividades_ids)).all()
        for foto in fotos:
            fotos_por_actividad.setdefault(foto.actividad_id, []).append(foto)

    return render_template(
        "detalle-miembro.html",
        miembro=miembro,
        comuna=comuna,
        actividades=actividades,
        bloques_por_actividad=bloques_por_actividad,
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
        tipo_miembro = request.form.get("tipo_miembro")
        detalle_tipo_miembro = request.form.get("detalle_tipo_miembro", "").strip()
        comuna_id = request.form.get("comuna")
        region_id = request.form.get("region")

        if tipo_miembro not in TIPOS_MIEMBRO:
            return "Tipo de miembro inválido", 400
        if not detalle_tipo_miembro:
            return "Detalle de tipo de miembro inválido", 400

        if not comuna_id or not comuna_id.isdigit():
            return "Comuna invalida", 400
        if not region_id or not region_id.isdigit():
            return "Region invalida", 400

        comuna = db.session.get(Comuna, int(comuna_id))
        if not comuna or comuna.region_id != int(region_id):
            return "La comuna seleccionada no corresponde a la region", 400

        nombre_actividad = request.form.get("nombreActividad")
        tipo_actividad = request.form.get("tipoActividad")
        descripcion = request.form.get("descripcion")

        try:
            bloques_horarios = obtener_bloques_desde_formulario()
        except ValueError as error:
            return str(error), 400

        primer_bloque = bloques_horarios[0]
        dia = primer_bloque["dia"]
        hora_inicio = primer_bloque["hora_inicio"]
        duracion = duracion_desde_bloques(bloques_horarios)

        # AQUÍ va lo de la foto
        foto = request.files.get("foto")

        ruta_archivo = None
        nombre_archivo = None

        if foto and foto.filename != "":
            nombre_archivo = secure_filename(foto.filename)
            ruta_archivo = f"uploads/{nombre_archivo}"
            ruta_guardado = os.path.join(app.static_folder, "uploads", nombre_archivo)
            foto.save(ruta_guardado)

        # DESPUÉS se guarda todo en la BD
        crear_registro_completo(
            nombre=nombre,
            email=email,
            telefono=telefono,
            tipo_miembro=tipo_miembro,
            detalle_tipo_miembro=detalle_tipo_miembro,
            comuna_id=comuna_id,
            nombre_actividad=nombre_actividad,
            tipo_actividad=tipo_actividad,
            dia=dia,
            hora_inicio=hora_inicio,
            duracion=duracion,
            descripcion=descripcion,
            bloques_horarios=bloques_horarios,
            ruta_archivo=ruta_archivo,
            nombre_archivo=nombre_archivo
        )

        return redirect(url_for("index"))

    return render_template("registro-miembros.html", regiones=regiones)

if __name__ == "__main__":
    app.run(debug=True)
