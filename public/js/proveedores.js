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
  pagination: true,
  search: true,
  columns: [
    {
      field: "id",
      title: "ID",
      sortable: true,
    },
    {
      field: "nombre",
      title: "Nombre",
      sortable: true,
    },
    {
      field: "mail",
      title: "Email",
    },
    {
      field: "telefonos",
      title: "Telefonos",
    },
    {
      field: "direccion",
      title: "Direccion",
    },
    {
      field: "contacto",
      title: "Contacto",
    },
  ],
});

const inicio = () => {
  S_CargarServerAuth(url_proveedores, "GET", {})
    .then((result) => {
      if (result.result === "ok") {
        result.data.forEach((element) => {
          element.id = element._id;

          $("#table").bootstrapTable("append", element);
        });
      }
    })
    .catch((err) => {});
};

const salir = () => {
  document.location.href = "stockaltapro.html";
};

// EVENTOS

// evento click api
$("#table").on("click-row.bs.table row", function (e, value, row, index) {
  dSetItem("datosProveedor", value);
  salir();
});
