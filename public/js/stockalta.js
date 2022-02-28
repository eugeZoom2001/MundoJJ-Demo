let operacion = "alta";
let idProveedorActual = "",
  proveedorActual = "";

let idRubro = "";
let saldoActalProveedor = 0,
  stockActual = 0;
let proveedoresArr = [],
  idProducto = null;
let proveedorActualArr = [];

$(document).ready(function () {
  // chequear si vengo de alta o modificacion
  AbrirSesion(TIEMPO_MAX_SESSION);
  start();

  
}); // on ready

const start = () => {
  if (Logueado()) {
    init()
      .then(() => {
        cargarProveedores();
      })
      .catch((err) => {});
  } else {
    CerrarSessionYSalir();
  }
};



async function init() {
  proveedorActual = null;
  let datos =dGetItem("datosStock");

  if (datos) {
    console.log("datos update ",datos);
    operacion = "update";
    idProveedorActual = datos.idProveedor;
    idRubro = datos.rubro;
    stockActual = datos.stock;
    idProducto = datos._id;
    codigoProducto = datos.id;
    //console.log("datos update",datos,operacion);
    cargarDatosStock(datos);
  } else {
    operacion = "alta";
    agregarItemSelect({ id: -1, nombre: " -- Proveedor ---" }, true);
    AgregarItemSelectRubro(
      { idRubro: -1, rubroNombre: " -- Seleccionar ---" },
      true
    );
    $("#btnBorrar").css("display", "none");
    $(".divStock").css("display", "none");
  }
}

const selectElement = document.getElementById("idSelectProveedor");
selectElement.addEventListener("change", (e) => {
  proveedorActualArr = proveedoresArr.filter((p) => p._id === e.target.value);
  idProveedorActual = e.target.value;
  //console.log("proveedor",e.target.value);
});

// convierte los string numeros decimales a float

const convertirNumeros = async (data) => {
  data.precio1 = data.precio1.replace(/,/g, ".");
  data.precio2 = data.precio2.replace(/,/g, ".");
  data.precio3 = data.precio3.replace(/,/g, ".");
  data.valor = data.valor.replace(/,/g, ".");
};

function cargarProveedores() {
  S_CargarServerAuth(url_proveedores, "GET", {})
    .then((result) => {
      //console.log("proveedores",result);
      proveedoresArr = result.data;
      proveedorActualArr = proveedoresArr.filter(
        (p) => p._id === idProveedorActual
      );
      cargarProveedoresSelect(proveedoresArr);
    })
    .catch((err) => {});
  S_CargarServerAuth(url_rubros, "GET", {})
    .then((result) => {
      if (result.data.length > 0) {
        // console.log("rubros", result); // ok
        CargarRubrosSelect(result.data);
      }
    })
    .catch((err) => {});
}

function CargarRubrosSelect(rubros) {
  // console.log("cargo rubros",rubros,"tipo",typeof(rubros));
  let itemNuevo = {};
  rubros.forEach((element) => {
    itemNuevo = {
      idRubro: element._id,
      rubroNombre: element.nombre,
    };
    AgregarItemSelectRubro(itemNuevo);
    //console.log(itemNuevo);
  });
}

function AgregarItemSelectRubro(item, selected = false) {
  //console.log("itemnuevo",item,"rubroActual",idRubro);
  let select = document.getElementById("idSelectRubro");
  let opcion = document.createElement("option");
  opcion.setAttribute("value", item.idRubro);
  if (item.idRubro === idRubro || selected) {
    opcion.setAttribute("selected", true);
  }
  opcion.innerText = item.rubroNombre;
  select.appendChild(opcion);
}

function cargarProveedoresSelect(proveedores) {
  //console.log("cargo proveedores",proveedores,"tipo",typeof(proveedores));
  let itemNuevo = {};
  proveedores.forEach((element) => {
    itemNuevo = {
      id: element._id,
      nombre: element.nombre,
    };
    agregarItemSelect(itemNuevo);
  });
}

function agregarItemSelect(item, selected = false) {
  let select = document.getElementById("idSelectProveedor");
  let opcion = document.createElement("option");
  opcion.setAttribute("value", item.id);
  if (item.id === idProveedorActual || selected) {
    opcion.setAttribute("selected", true);
  }
  opcion.innerText = item.nombre;
  select.appendChild(opcion);
}

function cargarDatosStock(data) {
  //es UPDATE
  $("#codigo").val(data.id);
  $("#descripcion").val(data.nombre);
  $("#rubro").val(data.rubro);
  $("#cantidad").val(0), $("#valor").val(data.valor);
  $("#stock").val(data.stock);
  $("#precio1").val(data.precio1);
  $("#condicion1").val(data.condicion1);
  $("#precio2").val(data.precio2);
  $("#condicion2").val(data.condicion2);
  $("#precio3").val(data.precio3);
  $("#condicion3").val(data.condicion3);
}

$("#btnBorrar").on("click", function () {
  //console.log("borro articulo", idProducto);
  S_CargarServerAuth(`${url_articulos}/${idProducto}`, "DELETE", {})
    .then((result) => {
      salir();
    })
    .catch((err) => {});
});

$("#btnGuardar").on("click", function () {
  obtenerDatos();
});

function obtenerDatos() {
  let datos = {
    id: $("#codigo").val(),
    descripcion: $("#descripcion").val(),
    rubro: $("#idSelectRubro").val(),
    valor: $("#valor").val(),
    cantidad: $("#cantidad").val(),
    precio1: $("#precio1").val(),
    condicion1: $("#condicion1").val(),
    precio2: $("#precio2").val(),
    condicion2: $("#condicion2").val(),
    precio3: $("#precio3").val(),
    condicion3: $("#condicion3").val(),
    comprobante: $("#comprobante").val(),
    operacion: operacion,
    idProveedor: $("#idSelectProveedor").val(),
  };
  if (validarDatos(datos)) {
    datos.stock = parseInt(datos.cantidad) + stockActual;
    datos.total = parseFloat(datos.cantidad) * parseFloat(datos.valor);
    datos.valor = parseFloat(datos.valor);
    datos.saldo = datos.total + proveedorActualArr[0].saldo;
    //total = total*parseFloat(datos.valor).toFixed(2);
    //  datos.total = total.toString();
    altaStock(datos);
  } else {
    MostrarAlerta("#alertStock", "Complete los datos requeridos", false);
  }
}

function altaStock(data) {
  //console.log("envio datos ...", data);
  const datosServer = {
    operacion: operacion,
    prov: {
      id: idProveedorActual,
      data: {
        saldo: data.saldo,
      },
    },
    art: {
      _id: idProducto,
      data: {
        id: data.id,
        proveedor: idProveedorActual,
        stock: data.stock,
        valor: data.valor,
        rubro: data.rubro,
        descripcion: data.descripcion,
        precio1: convertirNumero(data.precio1),
        condicion1: data.condicion1,
        precio2: convertirNumero(data.precio2),
        condicion2: data.condicion2,
        precio3: convertirNumero(data.precio3),
        condicion3: data.condicion3,
      },
    },
    cuenta: {
      proveedor: idProveedorActual,
      importe: data.total,
      comprobante: data.comprobante,
      operacion: "Compra " + data.cantidad + " " + data.id,
      saldo: data.saldo,
    },
  };
  //console.log("envio datos ...", datosServer);
  if (operacion === "alta") {
    crearArticulo(datosServer);
  } else {
    actualizarArticulo(datosServer);
  }
}

const actualizarArticulo = (data) => {
  //console.log("Actualizar Articulo", data);
  S_CargarServerAuth(`${url_articulos}/${data.art._id}`, "PATCH", data.art.data)
    .then((result) => {
      if (data.prov.data.saldo > 0) {
        S_CargarServerAuth(
          `${url_proveedores}/${data.prov.id}`,
          "PATCH",
          data.prov.data
        )
          .then((result) => {
            S_CargarServerAuth(url_proveedores_cta, "POST", data.cuenta);
          })
          .then((result) => {});
      }
      MostrarAlerta("#alertStock", "Exito", true, salir);
    })
    .catch((err) => {
      MostrarAlerta("#alertStock", "Error Codigo de Producto Duplicado", false);
    });
};

const crearArticulo = (data) => {
  //console.log("Crear Articulo", data,$("#codigo").val() );
  S_CargarServerAuth(url_articulos, "POST", data.art.data)
    .then((result) => {
      if (data.prov.data.saldo > 0) {
        S_CargarServer(
          `${url_proveedores}/${data.prov.id}`,
          "PATCH",
          data.prov.data
        )
          .then((result) => {
            S_CargarServerAuth(url_proveedores_cta, "POST", data.cuenta);
          })
          .then((result) => {});
      }
      MostrarAlerta("#alertStock", "Exito", true, salir);
    })
    .catch((err) => {
      MostrarAlerta("#alertStock", "Error Codigo de Producto Duplicado", false);
    });
};

function validarDatos(data) {
  //console.log("datos validar",data);
  let result = false;
  result =
    data.idProveedor != "-1" &&
    data.rubro != "-1" &&
    data.id.length > 0 &&
    data.descripcion.length > 0;
  return result;
}

const salir = () => {
  document.location.href = "stock.html";
};
