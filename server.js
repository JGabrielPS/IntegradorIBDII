const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");

const mysql = require("mysql");
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "integrador_triggers_procedimientos_funciones"
});
let query = "";

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

connection.connect(err => {
  if (err) throw err;
  console.log("Conexion exitosa");
});

app.use(cors());

app.get("/listarAlumno", (req, res) => {
  const dni = req.query.dni;
  query =
    "SELECT DISTINCT alumnos.id AS alumno_id, alumnos.nombre AS alumno_nombre, alumnos.nro_docu, carreras.id AS carrera_id, carreras.nombre AS carrera_nombre, sedes.sede_id, sedes.sede_nombre FROM alumnos INNER JOIN carreras ON alumnos.id_carrera = carreras.id INNER JOIN sedes ON alumnos.id_sede = sedes.sede_id WHERE alumnos.nro_docu = " +
    dni +
    " ORDER BY alumnos.id";
  connection.query(query, (err, rows) => {
    if (err) return res.json(err);
    let datos = JSON.parse(JSON.stringify(rows));
    return res.status(200).json(datos);
  });
});

app.get("/listarMaterias", (req, res) => {
  const carrera_id = req.query.carrera_id;
  query = `SELECT materias.id, materias.nombre FROM materias WHERE materias.id_carrera = ${carrera_id}`;
  connection.query(query, (err, rows) => {
    if (err) return res.json(err);
    let datos = JSON.parse(JSON.stringify(rows));
    return res.status(200).json(datos);
  });
});

app.post("/guardarInscripcion", (req, res) => {
  const { id_alumno, id_sede, id_materia, fecha_examen } = req.body;
  query = `INSERT INTO fset2019(id_sede, id_materia, id_alumno, fecha_examen) VALUES (${id_sede}, ${id_materia}, ${id_alumno}, '${fecha_examen}')`;
  connection.query(query, (err, rows) => {
    if (err) return res.json(err);
    return res.status(200).send("Registro guardado con exito");
  });
});

app.get("/listarAlumnosInscriptos", (req, res) => {
  connection.query("CALL Inscripciones()", (err, rows) => {
    if (err) return res.status(500).send(err.message);
    let arr = JSON.parse(JSON.stringify(rows[0]));
    return res.status(200).send(arr);
  });
});

//connection.end();

app.listen(3000, function() {
  console.log("Listening in port 3000");
});
