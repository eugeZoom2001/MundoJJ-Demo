$(document).ready(function () {
  AbrirSesion(TIEMPO_MAX_SESSION);
  start();
}); // on ready

const start = () => {
  if (Logueado()) {
  } else {
    CerrarSessionYSalir();
  }
};

$("#btnGuardar").on("click", function () {
  obtenerDatos();
});

$("#btnBorrar").on("click", function () {
  salir("stock.html");
});

function obtenerDatos() {
  let datos = {
    nombre: $("#rubro").val(),
  };
  if (validarDatos(datos)) {
    datos.nombre = datos.nombre.toUpperCase();
    altaRubro(datos);
  } else {
    MostrarAlerta("#alertStock", "Complete los datos requeridos", false);
  }
}

function altaRubro(data) {
  //console.log("envio datos ...", data);
  S_CargarServerAuth(url_rubros, "POST", data)
    .then((result) => {
      if (result) {
        if (result.result === "ok") {
          MostrarAlerta("#alertStock", "Rubro Agregado con Exito", true, sigo);
        } else {
          MostrarAlerta("#alertStock", "El Rubro ya Existe", false);
        }
      }
    })
    .catch((err) => {
      console.log("error", err);
    });
}

function validarDatos(datos) {
  let result = false;
  if (datos.nombre) {
    result = true;
  }
  return result;
}

const sigo = () => {
  $("#rubro").val("");
};

const salir = (adonde) => {
  document.location.href = adonde;
};
