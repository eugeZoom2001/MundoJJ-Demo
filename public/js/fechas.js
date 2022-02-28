function fechayHora() {
  var currentDate = new Date();
  var date = currentDate.getDate();
  var month = currentDate.getMonth();
  var year = currentDate.getFullYear();
  var hora = currentDate.getHours();
  var minutos = currentDate.getMinutes();

  var ddmmyyyy =
    pad(date) +
    "/" +
    pad(month + 1) +
    "/" +
    year +
    " " +
    hora +
    ":" +
    pad(minutos);
  //alert("fecha Hora"+ddmmyyyy);
  return ddmmyyyy;
}

function pad(n) {
  return n < 10 ? "0" + n : n;
}

function crearFechaDate(fecha) {
  let otra_fecha = fecha.replaceAll("-", "/");
  return new Date(otra_fecha);
}

function crearFechaStr() {
  var currentDate = new Date();
  var date = currentDate.getDate();
  var month = currentDate.getMonth();
  var year = currentDate.getFullYear();
  var ddmmyyyy = pad(date) + "/" + pad(month + 1) + "/" + year;
  return ddmmyyyy;
}

// *** recibe una fecha yyyy-mm-dd y lo convierte en dd/mm/AAAA
function crearFechaMostrar(fecha) {
  let ddmmyyyy = "";
  if (fecha != null) {
    if (fecha.length > 0) {
      let date = new Date(fecha);
      let anio = date.getFullYear();
      if (anio > 1970) {
        date.setHours(date.getHours() + 12);
        ddmmyyyy = date.toLocaleDateString();
      } else {
        ddmmyyyy = "";
      }
    } else {
      ddmmyyyy = "";
    }
  } else {
    ddmmyyyy = "";
  }

  return ddmmyyyy;
}

function crearFechaServer() {
  var currentDate = new Date();
  var date = currentDate.getDate();
  var month = currentDate.getMonth();
  var year = currentDate.getFullYear();
  //var yyyymmdd = pad(date) + "/" + pad(month + 1) + "/" + year;
  var yyyymmdd = year + "-" + pad(month + 1) + "-" + pad(date);

  return yyyymmdd;
}

// recibe un string dd/mm/yyyy y lo convierte en otro yyyy-mm-dd
const convertirFechaServer = (fecha) => {
  console.log(fecha);
  fechaNueva = "1970-01-01";
  if (fecha.length > 0) {
    let fechaArr = fecha.split("/");
    fechaNueva = fechaArr[2] + "-" + fechaArr[1] + "-" + fechaArr[0];
  }
  return fechaNueva;
};

//Funciones fecha y hora
/* recibe un String que representa una fecha Y hora en 
 formato 'dd/mm/aaaa" y devuelve otro String parseable por la funcion 
 Date()
*/

function convertirFechaHora(fechaHora) {
  let fechaHoraNueva = "2011/12/31 00:00";
  if (fechaHora.length > 8) {
    let fechaHoraStr = fechaHora.split(" ");
    let fechaNueva = fechaHoraStr[0].split("/");
    fecha = fechaNueva[2] + "/" + fechaNueva[1] + "/" + fechaNueva[0];
    fechaHoraNueva = fecha + " " + fechaHoraStr[1];
  }

  return fechaHoraNueva;
}

// *** contruye una fecha hora  a partir de 2 cadenas
//    "dd/mm/aaaa" y "mm:ss" y devuelme una cadena parseable parea Date()
//     aaaa/mm/dd mm:55

//****	calcula la diferencia de tiempo en unidades unid
//	donde unid puede ser "m":minutos ; "s":segundos ;h:horas
//	y las fechaHora son en formato Date()
function diferenciaT(fechaHoraH, fechaHoraD, unid) {
  var diferencia = fechaHoraH - fechaHoraD;

  switch (unid) {
    case "d":
      diferencia = diferencia / (3600000 * 24);
      break;
    case "h":
      diferencia = diferencia / 3600000;
      break;
    case "m":
      diferencia = diferencia / 60000;
      break;
    case "s":
      diferencia = diferencia / 1000;
      break;
    default:
  }
  return Math.floor(diferencia);
}
