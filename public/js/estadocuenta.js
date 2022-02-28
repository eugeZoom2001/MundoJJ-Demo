$(document).ready(function () {
  AbrirSesion(TIEMPO_MAX_SESSION);
  start();
}); // on ready

const start = () => {
  if (Logueado()) {
    inicio();
  } else {
    CerrarSessionYSalir();
  }
};

$("#table").bootstrapTable({
  // pagination: true,
  search: true,
  columns: [
    {
      field: "id",
      title: "ID",
    },
    {
      field: "nombre",
      title: "Nombre del Proveedor",
      sortable: true,
    },
    {
      field: "saldo",
      title: "Saldo Actual",
    },
  ],
});

function sumarColumnas(tabla) {
  let total = 0;
  tabla.forEach((element) => {
    total += element.saldo;
  });
  $("tfoot tr td").text(priceFormatter(total));
}

function priceFormatter(value) {
  return convertirAPesos(value.toString());
}

const inicio = () => {
  S_CargarServerAuth(url_proveedores, "GET", {})
    .then((result) => {
      if (result.result === "ok") {
        $("#table").bootstrapTable("append", result.data);
        sumarColumnas(result.data);
      }
    })
    .catch((err) => {
      console.log("error", err);
    });
};

const salir = () => {
  document.location.href = "resumencta.html";
};

// EVENTOS

// evento click api
$("#table").on("click-row.bs.table row", function (e, value, row, index) {
  dSetItem("datosEstadoCtaProv", value);
  salir();
});
