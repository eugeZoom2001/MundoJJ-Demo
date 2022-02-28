$("#divRecordarme").css("display", "none"); // no implementado
let ChkRecordarme = document.getElementById("idCheckRecordarme");
ChkRecordarme.checked = false;

function ObtenerDatos(response) {
  //console.log("respuesta", response);
  if (response.result === "ok") {
    dSetToken(response.data.token);
    const user = {
      id:response.data.id,
      nombre : response.data.user
     }
     //console.log("user", user)
      dSetUser(user);
      salir("clientes.html");
  }
}

const btnRegister = document.getElementById("idBotonRegister");
const btnLogin = document.getElementById("idBotonLogin");
let inputUsuario, inputPassword;
let parametros_login;

btnRegister.addEventListener(
  "click",
  () => {
    document.location.href = "register.html";
  },
  false
);
btnLogin.addEventListener("click", verificarDatos, false);

function verificarDatos() {
  inputUsuario = document.getElementById("idEmail").value;
  inputPassword = document.getElementById("idPassword").value;

  //document.location.href='historico.html';
  if (inputUsuario.length > 0 && inputPassword.length > 0) {
    parametros_login = { email: inputUsuario, password: inputPassword };
    S_CargarServer(url_login, "POST", parametros_login)
      .then((result) => {
        ObtenerDatos(result);
      })
      .catch((err) => {
        document.getElementById("idEmail").value = "";
        document.getElementById("idPassword").value = "";
        MostrarAlerta("#alertLogin", "Error : Verifique Los Datos", false);
      });
  } else {
    MostrarAlerta("#alertLogin", "Debe Ingresar los Datos", false);
  }
}

const salir = (adonde) => {
  document.location.href = adonde;
};
