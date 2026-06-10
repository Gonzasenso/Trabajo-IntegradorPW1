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
        alert("Usuario o contraseña incorrectos. Por favor, vuelva a intentarlo.");
    }
});

// Función auxiliar encargada de guardar el estado de sesión y redireccionar
function conectarUsuario(username, nombreParaMostrar) {
    sessionStorage.setItem("isLoggedIn", "true");

    // Username REAL (para búsquedas)
    sessionStorage.setItem("userName", username);

    // Nombre para mostrar en pantalla
    sessionStorage.setItem("displayName", nombreParaMostrar);

    alert(`¡Bienvenido/a, ${nombreParaMostrar}! Gracias por elegir Fly Lena nuevamente.`);

    window.location.href = "../../index.html";
}