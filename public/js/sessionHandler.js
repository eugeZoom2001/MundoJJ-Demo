function sSetRecordarme(valor) {
  localStorage.setItem("recordarme", valor);
}

function sGetRecordarme() {
  return localStorage.getItem("recordarme");
}

function sSetData(clave, valor) {
  localStorage.setItem(clave, valor);
}

function sGetData(clave) {
  return localStorage.getItem(clave);
}

function sVerificarUsuario() {
  let nombre = sGetData("nombre");
  //console.log("nombre", nombre," tipo ",typeof(nombre));
  if (nombre === "null") {
    // console.log("no estoy logueado");
    sCerrarPagina("login.html");
  } else {
    //console.log("logueado nombre ", nombre);
  }
}

function sCerrarPagina(adonde) {
  let recordarme = sGetRecordarme();
  if (recordarme) {
    if (recordarme === "no") {
      sessionStorage.clear();
    }
  }
  document.location.href = adonde;
}
