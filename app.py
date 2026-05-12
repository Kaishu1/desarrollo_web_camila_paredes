from flask import Flask, render_template

app = Flask(__name__)

@app.route("/estadisticas")
def estadisticas():
    return render_template("estadisticas.html")

@app.route("/index")
def index():
    return render_template("index.html")

@app.route("/listado-actividades")
def listadoActividades():
    return render_template("listado-actividades.html")

@app.route("/registro-miembros")
def registroMiembros():
    return render_template("registro-miembros.html")

if __name__ == "__main__":
    app.run(debug=True)