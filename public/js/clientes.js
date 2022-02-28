let tagBorrar = null,
  nombre;
let idBorrar,
  patenteBorrar,
  currentRowEdit = null;
let currentEditMovil = null,
  currentTareas = null;
let patenteActual,
  vencimiento1Actual = null,
  vencimiento2Actual = null;
let parametros_moviles = {};
$(document).ready(function () {
  $("#idVencimiento1").datepicker();
  $("#idVencimiento2").datepicker();
  $("#idModalVencimiento1").datepicker();
  $("#idModalVencimiento2").datepicker();
  $("#altaVencimiento1").datepicker();
  $("#altaVencimiento2").datepicker();
  AbrirSesion(TIEMPO_MAX_SESSION);
  start();
}); // on ready

const start = () => {
  if (Logueado()) {
    init();
  } else {
    CerrarSessionYSalir();
  }
};

function init() {
  S_CargarServerAuth(`${url_autos}`, "GET", {})
    .then((result) => {
      if (result) {
        if (result.result === "ok") {
          //console.log(result);
          result.data.forEach((element) => {
            let dataMovil = {
              nombre: element.nombre,
              telefono: element.telefono,
              mail: element.mail,
              marca: element.marca.toUpperCase(),
              patente: element.patente.toUpperCase(),
              km: element.km,
              id: element.id,
              vencimiento1: crearFechaMostrar(element.vencimiento1.trim()),
              vencimiento2: crearFechaMostrar(element.vencimiento2.trim()),
            };

            const itemNuevo = crearItem(dataMovil);
            agregarItemTabla(itemNuevo);
          });
        } else {
          alert("algo salio mal");
        }
      }
    })
    .catch((err) => {
      console.log("error", err);
    });
}
//  *************** Varios **************

function limpiarTareaModalEdit() {
  $("#idModalTarea").val("");
}

$("#btnAltaCliente").on("click", function () {
  $("#ModalAlta input").each(function (index, element) {
    $(element).val("");
  });
  limpiarTareas();
});

function limpiarTareas() {
  $("#idContainerTareas > p").each(function (index, element) {
    element.remove();
  });
}

$("#idBotonRefrescar").on("click", function () {
  $("#idBuscar").val("");
  Refrescar("#idBuscar");
});
$("#idBuscar").on("keyup", function () {
  var value = $(this).val().toLowerCase();
  $("#idTablaMovil tr").filter(function () {
    $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
  });
});

function Refrescar(tag) {
  var value = $(tag).val().toLowerCase();
  $("#idTablaMovil tr").filter(function () {
    $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
  });
}

function tablaContarItems() {
  return $("#idTablaMovil tr").length;
}

function validarDatosModal(data) {
  let datosValidos = false;
  datosValidos =
    data.nombre.length > 0 &&
    data.telefono.length > 0 &&
    data.mail.length > 0 &&
    data.marca.length > 0 &&
    data.patente.length > 0;
  return datosValidos;
}

// ************* ALTA MOVIL **********************

$("#ModalAlta").on("click", ".btn-guardarAlta", function () {
  let nombre = $("#altaNombre").val();
  let mail = $("#altaEmail").val();
  let telefono = $("#altaTelefono").val();
  let patente = $("#altaPatente").val().trim();
  let marca = $("#altaMarca").val();
  let tarea = $("#altaTarea").val().trim();
  let km = $("#altaKm").val();
  let vencimiento1 = $("#altaVencimiento1").val();
  let vencimiento2 = $("#altaVencimiento2").val();

  let data = {
    nombre: nombre,
    telefono: telefono,
    mail: mail,
    marca: marca,
    patente: patente.toUpperCase(),
    tarea: tarea,
    km: km,
    fechaTarea: crearFechaServer(),
    vencimiento1: convertirFechaServer(vencimiento1),
    vencimiento2: convertirFechaServer(vencimiento2),
    //vencimiento1: vencimiento1,
    //vencimiento2: vencimiento2,
  };
  if (validarDatosModal(data)) {
    console.log("alta datos", data);
    S_CargarServerAuth(`${url_autos}`, "POST", data)
      .then((result) => {
        //console.log("result" , result.result);
        if (result.result === "ok") {
          GuardarModalAlta(data);
        } else {
          MostrarAlerta(
            "#responseEditAlta",
            "Error: El Auto ya Existe!!",
            false
          );
        }
      })
      .catch((err) => {
        MostrarAlerta("#responseEditAlta", "Error: El Auto ya Existe!!", false);
      });
  } else {
    MostrarAlerta("#responseEditAlta", "Error:Complete los Datos!!", false);
  }
});

function GuardarModalAlta(data) {
  exito = true;

  if (exito) {
    const itemNuevo = crearItem(data);
    agregarItemTabla(itemNuevo);
    MostrarAlerta(
      "#responseEditAlta",
      "Cliente guardado con exito!",
      exito,
      () => {
        $("#ModalAlta").modal("hide");
      }
    );
  } else {
    MostrarAlerta("#responseEditAlta", "Error:Patente Ya Existe!!", exito);
  }
}

function agregarItemTabla(itemNuevo) {
  $("#idTablaMovil").append(itemNuevo);
}
function crearItem(itemLista) {
  let tr;
  tr = document.createElement("tr");
  // tr.addEventListener("click", seleccionarItem, false);

  let tdRow = document.createElement("th");
  tdRow.innerText = tablaContarItems();
  tdRow.setAttribute("scope", "row");
  //tdId.setAttribute('class','d-none');
  tr.appendChild(tdRow);

  let tdNombre = document.createElement("td");
  tdNombre.innerText = itemLista.nombre;
  tr.appendChild(tdNombre);

  let tdTelefono = document.createElement("td");
  //tdTelefono.setAttribute('name', "modelo")
  tdTelefono.innerText = itemLista.telefono;
  tr.appendChild(tdTelefono);

  let tdMail = document.createElement("td");
  //tdMail.setAttribute('name', "fechaHora")
  tdMail.innerText = itemLista.mail;
  tr.appendChild(tdMail);

  let tdMarca = document.createElement("td");
  //tdMarca.setAttribute('name', "modelo")
  tdMarca.innerText = itemLista.marca;
  tr.appendChild(tdMarca);

  let tdPatente = document.createElement("td");
  //tdPatente.setAttribute('name', "nombre")
  tdPatente.innerText = itemLista.patente.toUpperCase();
  tr.appendChild(tdPatente);

  let tdKm = document.createElement("td");
  //tdPatente.setAttribute('name', "nombre")
  tdKm.innerText = itemLista.km;
  tr.appendChild(tdKm);

  let tdId = document.createElement("td");
  tdId.innerText = itemLista.id;
  tdId.setAttribute("name", "id");
  tdId.setAttribute("class", "d-none");
  tr.appendChild(tdId);

  let tdVencimiento1 = document.createElement("td");
  tdVencimiento1.innerText = itemLista.vencimiento1;
  tdVencimiento1.setAttribute("class", "d-none");
  tr.appendChild(tdVencimiento1);

  let tdVencimiento2 = document.createElement("td");
  tdVencimiento2.innerText = itemLista.vencimiento2;
  tdVencimiento2.setAttribute("class", "d-none");
  tr.appendChild(tdVencimiento2);

  //Crear Botones
  let tdBotones = document.createElement("td");
  let divBotones = document.createElement("div");
  divBotones.setAttribute("class", "btn-group btn-group-sm");
  divBotones.setAttribute("role", "group");
  divBotones.setAttribute("aria-label", "Basic mixed styles example");

  let buttonBorrar = document.createElement("button");
  buttonBorrar.setAttribute("type", "button");
  buttonBorrar.setAttribute("class", "btn-borrar btn btn-danger");
  buttonBorrar.setAttribute("data-toggle", "modal");
  buttonBorrar.setAttribute("data-target", "#myModal2");
  buttonBorrar.innerText = "Borrar";
  tdBotones.appendChild(divBotones);

  let buttonEditar = document.createElement("button");
  buttonEditar.setAttribute("type", "button");
  buttonEditar.setAttribute("class", "btn-edit btn btn-success");
  buttonEditar.setAttribute("data-toggle", "modal");
  buttonEditar.setAttribute("data-target", "#myModal3");
  buttonEditar.innerText = "Editar";
  tdBotones.appendChild(divBotones);
  divBotones.appendChild(buttonBorrar);
  divBotones.appendChild(buttonEditar);
  tr.appendChild(tdBotones);

  return tr;
}

// ***************** EDITAR MOVIL

$("#idTablaMovil").on("click", ".btn-edit", function () {
  // obtiene la fila actual
  let currentRow = $(this).closest("tr");
  patenteActual = currentRow.find("td:eq(4)").text().trim();
  currentEditMovil = currentRow;
  // console.log("row",currentRow.children('th').text()); //ok
  let row = currentRow.children("th").text();
  currentRowEdit = row;
  let nombre = currentRow.find("td:eq(0)").text();
  let telefono = currentRow.find("td:eq(1)").text();
  let mail = currentRow.find("td:eq(2)").text();
  let marca = currentRow.find("td:eq(3)").text();
  let patente = currentRow.find("td:eq(4)").text();
  let km = currentRow.find("td:eq(5)").text();
  let id = currentRow.find("td:eq(6)").text();
  vencimiento1Actual = currentRow.find("td:eq(7)").text();
  vencimiento2Actual = currentRow.find("td:eq(8)").text();

  let data = {
    nombre: nombre,
    telefono: telefono,
    mail: mail,
    marca: marca,
    patente: patente,
    km: km,
    id: id,
    row: row,
    vencimiento1: vencimiento1Actual,
    vencimiento2: vencimiento2Actual,
  };

  limpiarTareas();

  S_CargarServerAuth(`${url_autos}/tareas/${patente}`, "GET", {})
    .then((result) => {
      if (result.result === "ok") {
        //console.log(result);
        cargarTareasMovil(result.data);
      }
    })
    .catch((err) => {});

  cargarModalMovil(data);
});

function cargarTareasMovil(arrTareas) {
  $.each(arrTareas, function (key, value) {
    //console.log( key + ": " + value.t_patente);
    agregarTarea(value.tarea, crearFechaMostrar(value.fecha));
  });
}

$("#myModal3").on("click", ".btn-guardarModal", function () {
  let nombre = $("#idModalNombre").val();
  let mail = $("#idModalMail").val();
  let telefono = $("#idModalTelefono").val();
  let patente = $("#idModalPatente").val().toUpperCase();
  let marca = $("#idModalMarca").val();
  let id = $("#idModalId").val();
  let km = $("#idModalKm").val();
  let tarea = $("#idModalTarea").val();
  let vencimiento1 = $("#idModalVencimiento1").val();
  let vencimiento2 = $("#idModalVencimiento2").val();

  let data = {
    nombre: nombre.toUpperCase(),
    telefono: telefono,
    mail: mail,
    marca: marca.toUpperCase(),
    patente: patente.toUpperCase(),
    patenteActual: patenteActual.toUpperCase(),
    km: km,
    id: id,
    tarea: tarea,
    fechaTarea: crearFechaServer(),
    vencimiento1: convertirFechaServer(vencimiento1),
    vencimiento2: convertirFechaServer(vencimiento2),
  };

  if (validarDatosModal(data)) {
    S_CargarServerAuth(`${url_autos}/${data.patenteActual}`, "PATCH", data)
      .then((result) => {
        GuardarEditarModal(data);
        //console.log("result update", result);
      })
      .catch((err) => {});
  } else {
    MostrarAlerta("#responseEdit", "Error : Complete los Campos!!", false);
  }
});

function cargarModalMovil(data) {
  //currentTareas=$("#idContainerTareas");
  // console.log(currentTareas.children());//ok paragrafos
  // Buscar tareas Server -> then

  $("#idModalNombre").val(data.nombre);
  $("#idModalMail").val(data.mail);
  $("#idModalTelefono").val(data.telefono);
  $("#idModalPatente").val(data.patente);
  $("#idModalMarca").val(data.marca);
  $("#idModalKm").val(data.km);
  $("#idModalId").val(data.id);
  $("#idModalVencimiento1").val(data.vencimiento1.trim());
  $("#idModalVencimiento2").val(data.vencimiento2.trim());
}

function GuardarEditarModal(data) {
  let vencimiento1Nuevo = crearFechaMostrar(data.vencimiento1);
  let vencimiento2Nuevo = crearFechaMostrar(data.vencimiento2);
  //console.log("guardar tabla modal ",vencimiento1Nuevo,vencimiento2Nuevo);
  if (currentEditMovil) {
    currentEditMovil.find("td:eq(0)").text(data.nombre);
    currentEditMovil.find("td:eq(1)").text(data.telefono);
    currentEditMovil.find("td:eq(2)").text(data.mail);
    currentEditMovil.find("td:eq(3)").text(data.marca);
    currentEditMovil.find("td:eq(4)").text(data.patente.toUpperCase());
    currentEditMovil.find("td:eq(5)").text(data.km);
    currentEditMovil.find("td:eq(6)").text(data.id);
    currentEditMovil.find("td:eq(7)").text(vencimiento1Nuevo);
    currentEditMovil.find("td:eq(8)").text(vencimiento2Nuevo);
    let tarea = $("#idModalTarea").val();
    if (tarea.length > 0) {
      agregarTarea(tarea, crearFechaStr());
    }

    let exito = true;
    if (exito) {
      MostrarAlerta(
        "#responseEdit",
        "Cambios Guardados con Exito!",
        exito,
        () => {
          limpiarTareaModalEdit();
          $("#myModal3").modal("hide");
        }
      );
    } else {
      MostrarAlerta("#responseEdit", "Error!!", exito);
    }
  }
}

function agregarTarea(tarea, fecha) {
  let tareaNueva;
  tareaNueva = document.createElement("p");
  tareaNueva.innerText = fecha + " " + tarea;

  document.getElementById("idContainerTareas").appendChild(tareaNueva);
}

// *************** BORRAR MOVIL *************************************

$("#idTablaMovil").on("click", ".btn-borrar", function () {
  let currentRow = $(this).closest("tr");
  idBorrar = currentRow.find("td:eq(6)").text();
  patenteBorrar = currentRow.find("td:eq(4)").text().trim();
  tagBorrar = $(this).closest("tr");
});

$("#myModal2").on("click", ".btn-borrarModal", function () {
  const patente = patenteBorrar;

  S_CargarServerAuth(`${url_autos}/${patente}`, "DELETE", {})
    .then((result) => {
      borrarMovil();
    })
    .catch((err) => {});
});

function borrarMovil() {
  if (tagBorrar) {
    tagBorrar.remove();
  }
  tagBorrar = null;
}
