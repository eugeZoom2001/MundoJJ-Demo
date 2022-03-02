let tagBorrar = null;
let idBorrar,
  patenteBorrar,
  currentRowEdit = null;
let currentEditMovil = null,
  currentTareas = null;
let patenteActual,
  vencimiento1Actual = null,
  vencimiento2Actual = null;
//let parametros_moviles = { cliente: id_empresa, tipoConsulta: "moviles" };
$(document).ready(function () {
  $("#idModalVencimiento1").datepicker();
  $("#idModalVencimiento2").datepicker();

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
  S_CargarServerAuth(url_autos, "GET", {})
    .then((result) => {
      if (result.result === "ok") {
        result.data.forEach((element) => {
          let dataMovil = {
            nombre: element.nombre,
            telefono: element.telefono,
            mail: element.mail,
            marca: element.marca.toUpperCase(),
            patente: element.patente.toUpperCase(),
            km: element.km,
            id: element._id,
            vencimiento1: crearFechaMostrar(element.vencimiento1.trim()),
            vencimiento2: crearFechaMostrar(element.vencimiento2.trim()),
          };
          dataMovil.venc1D = calcularDias(dataMovil.vencimiento1);
          dataMovil.venc2D = calcularDias(dataMovil.vencimiento2);

          const itemNuevo = crearItem(dataMovil);
          agregarItemTabla(itemNuevo);
        });
      } else {
        alert("algo salio mal");
      }
    })
    .catch((err) => {});
}

const calcularDias = (params) => {
  let dias = -500000;
  if (params.length > 0) {
    let fecha = params;
    fecha = convertirFechaServer(fecha);
    let date = new Date(fecha);
    dias = diferenciaT(new Date(), date, "d");
  }

  return dias;
};

// Varios

function cargarTareasMovil(arrTareas) {
  $.each(arrTareas, function (key, value) {
    agregarTarea(value.tarea, crearFechaMostrar(value.fecha));
  });
}

function agregarTarea(tarea, fecha) {
  let tareaNueva;
  tareaNueva = document.createElement("p");
  tareaNueva.innerText = fecha + " " + tarea;

  document.getElementById("idContainerTareas").appendChild(tareaNueva);
}
function limpiarTareas() {
  $("#idContainerTareas > p").each(function (index, element) {
    element.remove();
  });
}

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

$("#idBotonRefrescar").on("click", function () {
  $("#idBuscar").val("");
  Refrescar("#idBuscar");
});

function tablaContarItems() {
  return $("#idTablaMovil tr").length;
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

  let patente = currentRow.find("td:eq(4)").text();

  vencimiento1Actual = currentRow.find("td:eq(6)").text();
  vencimiento2Actual = currentRow.find("td:eq(7)").text();

  let data = {
    patente: patente,
    vencimiento1: vencimiento1Actual,
    vencimiento2: vencimiento2Actual,
  };

  limpiarTareas();

  S_CargarServerAuth(`${url_autos}/tareas/${data.patente}`, "GET", {})
    .then((result) => {
      if (result.result === "ok") {
        cargarTareasMovil(result.data);
      }
    })
    .catch((err) => {});

  cargarModalMovil(data);
});

function cargarModalMovil(data) {
  $("#idModalPatente").val(data.patente);
  $("#idModalVencimiento1").val(data.vencimiento1.trim());
  $("#idModalVencimiento2").val(data.vencimiento2.trim());
}

$("#myModal6").on("click", ".btn-guardarModal", function () {
  let vencimiento1 = $("#idModalVencimiento1").val();
  let vencimiento2 = $("#idModalVencimiento2").val();

  let dataUpdate = {
    patente: patenteActual,
    vencimiento1: convertirFechaServer(vencimiento1),
    vencimiento2: convertirFechaServer(vencimiento2),
  };

  S_CargarServerAuth(`${url_autos}/${patenteActual}`, "PATCH", dataUpdate)
    .then((result) => {
      if (result.result === "ok") {
        GuardarEditarModal(dataUpdate);
      }
    })
    .catch((err) => {
      alert("Hubo un error");
    });
});

function GuardarEditarModal(data) {
  currentEditMovil.find("td:eq(6)").text(crearFechaMostrar(data.vencimiento1));
  let fechaV1 = convertirFechaServer(currentEditMovil.find("td:eq(6)").text());
  fechaV1 = crearFechaDate(fechaV1);
  let diasV1 = diferenciaT(new Date(), fechaV1, "d");
  currentEditMovil.find("td:eq(6)").attr("class", VenciClaseCelda(diasV1));

  currentEditMovil.find("td:eq(7)").text(crearFechaMostrar(data.vencimiento2));
  let fechaV2 = convertirFechaServer(currentEditMovil.find("td:eq(7)").text());
  fechaV2 = crearFechaDate(fechaV2);
  let diasV2 = diferenciaT(new Date(), fechaV2, "d");
  currentEditMovil.find("td:eq(7)").attr("class", VenciClaseCelda(diasV2));

  let exito = true;
  if (exito) {
    MostrarAlerta(
      "#responseEditActualizar",
      "Cambios Guardados con Exito!",
      exito,
      () => {
        $("#myModal6").modal("hide");
      }
    );
  } else {
    MostrarAlerta("#responseEditActualizar", "Error!!", exito);
  }
}

// ************** BORRAR MOVIL

$("#idTablaMovil").on("click", ".btn-borrar", function () {
  let currentRow = $(this).closest("tr");
  patenteBorrar = currentRow.find("td:eq(4)").text();
  tagBorrar = $(this).closest("tr");
});

$("#myModal5").on("click", ".btn-borrarModal", function () {
  S_CargarServerAuth(`${url_autos}/${patenteBorrar}`, "DELETE", {})
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

function agregarItemTabla(itemNuevo) {
  $("#idTablaMovil").append(itemNuevo);
}
function crearItem(itemLista) {
  let tr;
  tr = document.createElement("tr");

  let tdRow = document.createElement("th");
  tdRow.innerText = tablaContarItems();
  tdRow.setAttribute("scope", "row");
  tr.appendChild(tdRow);

  let tdNombre = document.createElement("td");
  tdNombre.innerText = itemLista.nombre;
  tr.appendChild(tdNombre);

  let tdTelefono = document.createElement("td");
  tdTelefono.innerText = itemLista.telefono;
  tr.appendChild(tdTelefono);

  let tdMail = document.createElement("td");
  tdMail.innerText = itemLista.mail;
  tr.appendChild(tdMail);

  let tdMarca = document.createElement("td");
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

  let tdVencimiento1 = document.createElement("td");
  tdVencimiento1.innerText = itemLista.vencimiento1;
  // tdVencimiento1.setAttribute("class", "d-none");
  tdVencimiento1.setAttribute("class", VenciClaseCelda(itemLista.venc1D));
  tr.appendChild(tdVencimiento1);

  let tdVencimiento2 = document.createElement("td");
  tdVencimiento2.innerText = itemLista.vencimiento2;
  //tdVencimiento2.setAttribute("class", "d-none");
  tdVencimiento2.setAttribute("class", VenciClaseCelda(itemLista.venc2D));
  tr.appendChild(tdVencimiento2);

  //Crear Botones
  let tdBotones = document.createElement("td");
  let divBotones = document.createElement("div");
  divBotones.setAttribute("class", "btn-group btn-group-sm");

  divBotones.setAttribute("role", "group");
  divBotones.setAttribute("aria-label", "Basic mixed styles example");

  let buttonEditar = document.createElement("button");
  buttonEditar.setAttribute("type", "button");
  buttonEditar.setAttribute("class", "btn-edit btn btn-outline-primary");
  buttonEditar.setAttribute("data-toggle", "modal");
  buttonEditar.setAttribute("data-target", "#myModal6");
  buttonEditar.innerText = "Actualizar";

  let buttonBorrar = document.createElement("button");
  buttonBorrar.setAttribute("type", "button");
  buttonBorrar.setAttribute("class", "btn-borrar btn btn-outline-danger");
  buttonBorrar.setAttribute("data-toggle", "modal");
  buttonBorrar.setAttribute("data-target", "#myModal5");
  buttonBorrar.innerText = "Eliminar";
  tdBotones.appendChild(divBotones);
  tdBotones.appendChild(divBotones);

  divBotones.appendChild(buttonEditar);
  divBotones.appendChild(buttonBorrar);
  tr.appendChild(tdBotones);

  return tr;
}

function VenciClaseCelda(valor) {
  // console.log("dias", valor);
  const x = valor;
  let color = "bg-light";
  switch (true) {
    case x > -10 && x < 0:
      color = "bg-warning";
      break;
    case x >= 0:
      color = "bg-danger";
      break;
    default:
      color = "bg-light";
      break;
  }
  return color;
}

function VenciMFechaClaseCelda(valor) {
  const x = valor;
  let color = "bg-light";
  switch (true) {
    case x > -10 && x < 0:
      color = "bg-warning";
      break;
    case x >= 0:
      color = "bg-light";
      break;
    default:
      color = "bg-light";
      break;
  }
  return color;
}
