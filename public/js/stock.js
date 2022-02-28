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
      title: "Codigo",
      sortable: true,
    },
    {
      field: "nombre",
      title: "Descripcion",
      sortable: true,
    },
    {
      field: "valor",
      title: "Precio",
    },
    {
      field: "rubro",
      title: "Rubro",
    },
    {
      field: "stock",
      title: "Cantidad",
    },
    {
      field: "proveedor",
      title: "Proveedor",
      sortable: true,
    },
    {
      field: "precio1",
      title: "Precio1",
    },
    {
      field: "condicion1",
      title: "Condicion1",
    },
    {
      field: "precio2",
      title: "Precio2",
    },
    {
      field: "condicion2",
      title: "Condicion2",
    },
    {
      field: "precio3",
      title: "Precio3",
    },
    {
      field: "condicion3",
      title: "Condicion3",
    },
    {
      field: "idProveedor",
      title: "Proveedor",
    },
  ],
});

function priceFormatter(value) {
  // console.log(value);
  return convertirAPesos(value.toString());
  //return '<i class="fa fa-dollar-sign"></i>' + value;
}

const inicio = () => {
  S_CargarServerAuth(url_articulos, "GET", {})
    .then((result) => {
      if (result.result === "ok") {
        result.data.forEach((element) => {
         
          if(!element.proveedor){
            element.proveedor={
              _id:null,
              nombre:null
            }
          }
          let articulo = {
            id: element.id,
            _id:element._id,
            idProveedor: element.proveedor._id,
            proveedor: element.proveedor.nombre,
            rubro: element.rubro._id,
            stock: element.stock,
            nombre: element.descripcion,
            cantidad: element.cantidad,
            valor: element.valor,
            precio1: element.precio1,
            precio2: element.precio2,
            precio3: element.precio3,
          };
          $("#table").bootstrapTable("append", articulo);
        });
      }
    })
    .catch((err) => {
      console.log("error", err);
    });
};

const salir = () => {
  document.location.href = "stockalta.html";
};

// EVENTOS

// evento click api
$("#table").on("click-row.bs.table row", function (e, value, row, index) {
  //console.log("click api",row.find("td:eq(1)").text()); // ok trae el nombre
  //console.log("click api", value); // genial trae un json con  los valores
  
  dSetItem("datosStock", value);
  salir();
});
