const btnRegister = document.getElementById("idBotonRegister");
let inputUsuario, inputPassword, inputPassword2;
let parametros_register;
btnRegister.addEventListener("click", verificarDatos, false);

function verificarDatos() {
  inputNombre = document.getElementById("idNombre").value;
  inputEmail = document.getElementById("idEmail").value;
  inputPassword = document.getElementById("idPassword").value;
  inputPassword2 = document.getElementById("idPassword2").value;
  if (
    inputNombre.length > 0 &&
    inputEmail.length > 0 &&
    inputPassword.length > 0 &&
    inputPassword2.length > 0
  ) {
    if (inputPassword !== inputPassword2) {
      MostrarAlerta("#alertRegister", "Las contraseñas no coinciden", false);
    } else {
      parametros_register = {
        nombre: inputNombre,
        email: inputEmail,
        password: inputPassword,
      };
      console.log("parametros login", parametros_register);
      S_CargarServer(url_register, "POST", parametros_register)
        .then((result) => {
          MostrarAlerta(
            "#alertRegister",
            "Usuario Registrado con exito",
            true,
            salir("login.html")
          );
        })

        .catch((err) => {
          MostrarAlerta("#alertRegister", "El usuario ya existe", false);
        });
    }
  } else {
    MostrarAlerta("#alertRegister", "Debe Ingresar los Datos", false);
  }
}

const salir = (adonde) => {
  document.location.href = adonde;
};
