let operacion = "alta";
let idProveedor = "";
let datos = {};
$(document).ready(function () {
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

const init = () => {
  datos = dGetItem("datosProveedor");
  //console.log("datos",datos);
  // chequear si vengo de alta o modificacion
  if (datos) {
    operacion = "update";
    idProveedor = datos.id;
    //console.log("idProveedor", idProveedor);
    datos.operacion = operacion;
    datos.idProveedor = idProveedor;
    cargarDatosProveedor(datos);
  } else {
    operacion = "alta";
    $("#btnBorrar").css("display", "none");
  }
};

$("#btnBorrar").on("click", function () {
  $("#modalBorrar").modal("show");
});

$("#btnBorrarProveedor").on("click", function () {
  // console.log("borro datos :", url, method);
  S_CargarServerAuth(`${url_proveedores}/${idProveedor}`, "DELETE", {})
    .then((result) => {
      S_CargarServerAuth(`${url_proveedores_cta}/${idProveedor}`, "DELETE", {});
      salir();
    })
    .catch((err) => {
      //console.log("error delete proveedor", err);
    });
});

$("#btnGuardar").on("click", function () {
  obtenerDatos();
});

function cargarDatosProveedor(data) {
  // es update

  $("#proveedor").val(data.nombre);
  $("#email").val(data.mail);
  $("#telefonos").val(data.telefonos);
  $("#direccion").val(data.direccion);
  $("#contacto").val(data.contacto);
}

function obtenerDatos() {
  let datos = {
    nombre: $("#proveedor").val().toUpperCase(),
    mail: $("#email").val(),
    telefonos: $("#telefonos").val(),
    direccion: $("#direccion").val().toUpperCase(),
    contacto: $("#contacto").val(),
    operacion: operacion,
    idProveedor: idProveedor,
  };
  if (validarDatos(datos)) {
    altaProveedor(datos);
  } else {
    MostrarAlerta("#alertStock", "Complete los datos requeridos", false);
  }
}

function altaProveedor(data) {
  //console.log("envio datos ...", data);
  let url = url_proveedores,
    method = "POST";

  if (data.operacion === "alta") {
    //  console.log("es alta" , url,method);
  } else if (data.operacion === "update") {
    url = `${url}/${idProveedor}`;
    method = "PATCH";
    //console.log("es update", url , method );
  } else {
    console.log("no es nada");
  }
  S_CargarServerAuth(url, method, data)
    .then((result) => {
      salir();
    })
    .catch((err) => {
      // console.log("error");
    });
}

function validarDatos(datos) {
  let result = false;
  if (datos.nombre) {
    result = true;
  }
  return result;
}

const salir = () => {
  document.location.href = "proveedores.html";
};
