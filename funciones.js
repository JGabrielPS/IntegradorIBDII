let dni = 0;
let alumno_id = 0;
let sede_id = 0;
let carrera_id = 0;

function buscarAlumno() {
  dni = document.querySelector("#dni").value;
  axios
    .get("http://localhost:3000/listarAlumno", {
      params: {
        dni: `${document.querySelector("#dni").value}`
      }
    })
    .then(response => {
      response.data.forEach(e => {
        alumno_id = e.alumno_id;
        document.querySelector(
          "#sede"
        ).innerHTML += `<input type="text" class="form-control" value='${e.sede_nombre}' data-sede_id=${e.sede_id}>`;
        sede_id = e.sede_id;
        document.querySelector(
          "#carrera"
        ).innerHTML += `<input type="text" class="form-control" value='${e.carrera_nombre}' data-carrera_id=${e.carrera_id}>`;
        carrera_id = e.carrera_id;
        axios
          .get("http://localhost:3000/listarMaterias", {
            params: { carrera_id: `${e.carrera_id}` }
          })
          .then(response => {
            response.data.forEach(e => {
              document.querySelector(
                "#materia"
              ).innerHTML += `<option id=${e.id}>${e.nombre}</option>`;
            });
          })
          .catch(error => {
            alert(error);
          });
      });
      hiddenFields(false);
    })
    .catch(error => {
      alert(error);
    });
}

function guardarInscripcion() {
  axios
    .post("http://localhost:3000/guardarInscripcion", {
      id_alumno: `${alumno_id}`,
      id_sede: `${sede_id}`,
      id_materia: `${
        document.querySelector("#materia").options[
          document.querySelector("#materia").selectedIndex
        ].id
      }`,
      fecha_examen: `${document.querySelector("#fecha_examen").value}`
    })
    .then(response => {
      alert(response.data);
      axios
        .get("http://localhost:3000/listarAlumnosInscriptos")
        .then(response => {
          const table =
            "<table class='table'><thead class='thead-dark'><tr><th scope='col'>Nombre del alumno</th><th scope='col'>Sede</th><th scope='col'>Fecha de examen</th></thead><tbody id='inscriptos'></tbody></table>";
          document.querySelector("#principal").innerHTML += table;
          let template = "";
          response.data.forEach(e => {
            let fecha = new Date(e.fecha_examen);
            template += `<tr><td scope="row">${e.nombre}</td><td scope="row">${
              e.sede_nombre
            }</td><td scope="row">${fecha.getDay()}/${fecha.getMonth() +
              1}/${fecha.getFullYear()}</td></tr>`;
          });
          document.querySelector("#inscriptos").innerHTML = template;
          clearFields();
          hiddenFields(true);
        })
        .catch(error => {
          alert(error);
        });
    })
    .catch(error => {
      alert(error);
    });
}

function clearFields() {
  document.querySelector('#sede input').remove();
  document.querySelector('#carrera input').remove();
}

function hiddenFields(condicion) {
  document.querySelector("#sede").hidden = condicion;
  document.querySelector("#carrera").hidden = condicion;
  document.querySelector("#divMateria").hidden = condicion;
  document.querySelector("#divFechaExamen").hidden = condicion;
  document.querySelector("#divGuardar").hidden = condicion;
}
