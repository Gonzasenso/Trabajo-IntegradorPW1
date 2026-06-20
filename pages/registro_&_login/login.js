const mensajeLogin = document.getElementById("mensajeLogin");

const formLogin = document.getElementById("form-login");

//Verificacion de Usuario (Si esta registrado y/o es Adm)
formLogin.addEventListener("submit", function (e) {
    e.preventDefault();

    const usuarioIngresado = document.getElementById("usuario").value.trim();
    const passwordIngresada = document.getElementById("password").value;

    if (usuarioIngresado === "adm" && passwordIngresada === "1234") {
        conectarUsuario("Administrador", "Administrador");
        return;
    }

    const listaUsuarios = JSON.parse(localStorage.getItem("usuariosRegistrados")) || [];

    const usuarioEncontrado = listaUsuarios.find(u =>
        (
            u.username.toLowerCase() === usuarioIngresado.toLowerCase() ||
            u.email.toLowerCase() === usuarioIngresado.toLowerCase()
        ) &&
        u.password === passwordIngresada
    );

    if (usuarioEncontrado) {
        conectarUsuario(
            usuarioEncontrado.username,
            usuarioEncontrado.nombre
        );
    } else {
        mensajeLogin.textContent =
            "Usuario o contraseña incorrectos.";

        mensajeLogin.className =
            "mensajeLogin mensajeError";

        mensajeLogin.style.display =
            "block";
    }
});

// Función auxiliar encargada de guardar el estado de sesión y redireccionar
function conectarUsuario(username, nombreParaMostrar) {
    sessionStorage.setItem("isLoggedIn", "true");

    // Username REAL (para búsquedas)
    sessionStorage.setItem("userName", username);

    // Nombre para mostrar en pantalla
    sessionStorage.setItem("displayName", nombreParaMostrar);

    mensajeLogin.textContent =
        `¡Bienvenido/a, ${nombreParaMostrar}!`;

    mensajeLogin.className =
        "mensajeLogin mensajeExito";

    mensajeLogin.style.display =
        "block";
        
    setTimeout(() => {

        window.location.href =
            "../../index.html";

    }, 1500);
}