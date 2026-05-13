from flask import Flask, render_template, request, redirect, url_for
from database import db
from database.db import db, Miembro, crear_miembro

app = Flask(__name__)

app.config["SQLALCHEMY_DATABASE_URI"] = "mysql+pymysql://cc5002:programacionweb@localhost:3306/tarea2"

app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db.init_app(app)

# r u t a s 
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

@app.route("/registro-miembros", methods=["GET", "POST"])
def registroMiembros():
    if request.method == "POST":
        nombre = request.form["nombre"]
        email = request.form["correo"]
        telefono = request.form["telefono"]

        crear_miembro(nombre, email, telefono)

        return redirect(url_for("index"))

    exito = request.args.get("exito")
    return render_template("registro-miembros.html", exito=exito)

if __name__ == "__main__":
    app.run(debug=True)