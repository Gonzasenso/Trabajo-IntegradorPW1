// ── Referencias al DOM ─────────────────────────────────────────────────────────
const formLogin = document.getElementById("form-login");
const inputUsuario = document.getElementById("usuario");
const inputPassword = document.getElementById("password");
 
// ── Helpers de validación visual ───────────────────────────────────────────────
function marcarValido(input) {
    input.style.border = "1px solid #2ecc71";
    input.style.boxShadow = "0 0 0 0.3rem rgba(46, 204, 113, 0.2)";
    input.style.backgroundColor = "#eafaf1";
 
    const msgEl = input.parentElement.querySelector(".msg-validacion");
    if (msgEl) {
        msgEl.textContent = "✔ Correcto";
        msgEl.style.color = "#2ecc71";
    }
}
 
function marcarInvalido(input, mensaje) {
    input.style.border = "1px solid #e74c3c";
    input.style.boxShadow = "0 0 0 0.3rem rgba(231, 76, 60, 0.2)";
    input.style.backgroundColor = "#fdeaea";
 
    const msgEl = input.parentElement.querySelector(".msg-validacion");
    if (msgEl) {
        msgEl.textContent = "✖ " + mensaje;
        msgEl.style.color = "#e74c3c";
    }
}
 
function quitarEstilos(input) {
    input.style.border = "";
    input.style.boxShadow = "";
    input.style.backgroundColor = "";
 
    const msgEl = input.parentElement.querySelector(".msg-validacion");
    if (msgEl) msgEl.textContent = "";
}
 
// ── Validación en tiempo real (solo después de que el usuario toca el campo) ───
[inputUsuario, inputPassword].forEach(input => {
    input.addEventListener("input", () => {
        input.dataset.touched = "true";
        validarCampoSolo(input);
    });
 
    input.addEventListener("blur", () => {
        input.dataset.touched = "true";
        validarCampoSolo(input);
    });
});
 
function validarCampoSolo(input) {
    if (!input.dataset.touched) return;

    const valor = input.value.trim();

    if (!valor) {
        const nombre = input.id === "usuario" ? "usuario o email" : "contraseña";
        marcarInvalido(input, `Ingresá tu ${nombre}`);
        return false;
    }

    if (input.id === "usuario") {
        if (valor.length < 3) {
            marcarInvalido(input, "Mínimo 3 caracteres");
            return false;
        }
        // Chequeo real contra localStorage
        const esAdmin = valor.toLowerCase() === "adm";
        const listaUsuarios = JSON.parse(localStorage.getItem("usuariosRegistrados")) || [];
        const existe = listaUsuarios.some(u =>
            u.username.toLowerCase() === valor.toLowerCase() ||
            u.email.toLowerCase() === valor.toLowerCase()
        );
        if (!esAdmin && !existe) {
            marcarInvalido(input, "Usuario o email no registrado");
            return false;
        }
    }

    if (input.id === "password" && valor.length < 4) {
        marcarInvalido(input, "Mínimo 4 caracteres");
        return false;
    }

    marcarValido(input);
    return true;
}
 
// ── Submit ─────────────────────────────────────────────────────────────────────
formLogin.addEventListener("submit", function (e) {
    e.preventDefault();
 
    // Marcar ambos campos como tocados para mostrar errores
    inputUsuario.dataset.touched = "true";
    inputPassword.dataset.touched = "true";
 
    const usuarioVal = inputUsuario.value.trim();
    const passwordVal = inputPassword.value.trim();
 
    // Caso A: ambos campos vacíos
    if (!usuarioVal && !passwordVal) {
        marcarInvalido(inputUsuario, "Ingresá tu usuario o email");
        marcarInvalido(inputPassword, "Ingresá tu contraseña");
        Swal.fire({
            icon: "error",
            title: "Campos vacíos",
            html: `<p style="font-size:1.5rem">Completá tu <b>usuario o email</b> y tu <b>contraseña</b> para continuar.</p>`,
            confirmButtonColor: "#e74c3c",
            confirmButtonText: "Entendido"
        });
        return;
    }
 
    // Caso B: falta uno de los dos
    if (!usuarioVal || !passwordVal) {
        let htmlMsg = `<p style="font-size:1.5rem">Te falta completar:</p><ul style="text-align:left;margin-top:10px;padding-left:20px;font-size:1.4rem">`;
        if (!usuarioVal) {
            marcarInvalido(inputUsuario, "Ingresá tu usuario o email");
            htmlMsg += `<li><b>Usuario o Email</b></li>`;
        } else {
            validarCampoSolo(inputUsuario);
        }
        if (!passwordVal) {
            marcarInvalido(inputPassword, "Ingresá tu contraseña");
            htmlMsg += `<li><b>Contraseña</b></li>`;
        } else {
            validarCampoSolo(inputPassword);
        }
        htmlMsg += `</ul>`;
        Swal.fire({
            icon: "error",
            title: "Campo incompleto",
            html: htmlMsg,
            confirmButtonColor: "#e74c3c",
            confirmButtonText: "Entendido"
        });
        return;
    }
 
    // Verificación de admin
    if (usuarioVal === "adm" && passwordVal === "1234") {
        conectarUsuario("Administrador", "Administrador");
        return;
    }
 
    // Verificación contra lista de usuarios registrados
    const listaUsuarios = JSON.parse(localStorage.getItem("usuariosRegistrados")) || [];
    const usuarioEncontrado = listaUsuarios.find(u =>
        (
            u.username.toLowerCase() === usuarioVal.toLowerCase() ||
            u.email.toLowerCase() === usuarioVal.toLowerCase()
        ) &&
        u.password === passwordVal
    );
 
    if (usuarioEncontrado) {
        conectarUsuario(usuarioEncontrado.username, usuarioEncontrado.nombre);
    } else {
        // Credenciales incorrectas: marcar ambos campos en rojo
        marcarInvalido(inputUsuario, "Usuario o email inválido");
        marcarInvalido(inputPassword, "Contraseña inválida");
        Swal.fire({
            icon: "error",
            title: "Credenciales incorrectas",
            html: `<p style="font-size:1.5rem">El usuario/email o la contraseña no son correctos.<br>Verificá tus datos e intentá nuevamente.</p>`,
            confirmButtonColor: "#e74c3c",
            confirmButtonText: "Reintentar"
        });
    }
});
 
// ── Función auxiliar: guarda sesión y redirige ─────────────────────────────────
function conectarUsuario(username, nombreParaMostrar) {
    sessionStorage.setItem("isLoggedIn", "true");
    sessionStorage.setItem("userName", username);
    sessionStorage.setItem("displayName", nombreParaMostrar);
 
    // Caso C: pop up de éxito con cuenta regresiva visual
    let segundos = 2;
    Swal.fire({
        icon: "success",
        title: `¡Bienvenido/a, ${nombreParaMostrar}!`,
        html: `<p style="font-size:1.5rem">Redirigiendo al inicio en <b id="cuenta">${segundos}</b> segundo${segundos !== 1 ? "s" : ""}...</p>`,
        showConfirmButton: false,
        allowOutsideClick: false,
        allowEscapeKey: false,
        timer: segundos * 1000,
        timerProgressBar: true,
        didOpen: () => {
            // Actualiza el número en pantalla cada segundo
            const intervalo = setInterval(() => {
                segundos--;
                const el = document.getElementById("cuenta");
                if (el) el.textContent = segundos;
                if (segundos <= 0) clearInterval(intervalo);
            }, 1000);
        },
        willClose: () => {
            window.location.href = "../../index.html"; // #################### RUTA INDEX
        }
    });
}
 
// ── EXTRA: Toggle mostrar/ocultar contraseña ───────────────────────────────────
const togglePass = document.getElementById("togglePass");
if (togglePass) {
    togglePass.addEventListener("click", () => {
        const esPassword = inputPassword.type === "password";
        inputPassword.type = esPassword ? "text" : "password";
        togglePass.textContent = esPassword ? "🙈 Ocultar contraseña" : "👁 Mostrar contraseña";
    });
}
