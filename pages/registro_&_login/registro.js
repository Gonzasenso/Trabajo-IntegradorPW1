const formRegistro = document.getElementById("form-registro");
 
const campos = {
    username:   document.getElementById("username"),
    passwordReg: document.getElementById("password-reg"),
    nombre1:    document.getElementById("nombre1"),
    nombre2:    document.getElementById("nombre2"),
    apellido:   document.getElementById("apellido"),
    tipoDoc:    document.getElementById("tipo_doc"),
    numDoc:     document.getElementById("num_doc"),
    fechaNac:   document.getElementById("fecha_nac"),
    email:      document.getElementById("email"),
    telefono:   document.getElementById("telefono"),
    direccion:  document.getElementById("direccion"),
    cp:         document.getElementById("cp"),
    localidad:  document.getElementById("localidad"),
};
 
//Validaciones
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
 
//Logica de Validacion
function validarCampo(input) {
    if (!input) return true;
    const valor = input.value.trim();
    const id = input.id;
 
    if (!valor && id === "nombre2") {
        quitarEstilos(input);
        return true;
    }

    if (!valor) {
        marcarInvalido(input, "Este campo es obligatorio");
        return false;
    }
 
    const regexLetras = /^[a-zA-Z\sñáéíóúÁÉÍÓÚ]+$/;
    const regexUsername = /^[a-zA-Z0-9_ñÑ]+$/;
 
    if (id === "username") {
        if (!regexUsername.test(valor)) {
            marcarInvalido(input, "Solo letras, números y guion bajo, sin espacios");
            return false;
        }
        if (valor.length < 4) {
            marcarInvalido(input, "Mínimo 4 caracteres");
            return false;
        }
        // Chequeo de username duplicado en tiempo real
        const lista = JSON.parse(localStorage.getItem("usuariosRegistrados")) || [];
        if (lista.some(u => u.username.toLowerCase() === valor.toLowerCase())) {
            marcarInvalido(input, `"${valor}" ya está en uso`);
            return false;
        }
    }
 
    if (id === "password-reg") {
        if (valor.length < 4) {
            marcarInvalido(input, "Mínimo 4 caracteres");
            return false;
        }
    }
 
    if (id === "nombre1" || id === "nombre2" || id === "apellido") {
        if (!regexLetras.test(valor)) {
            marcarInvalido(input, "Solo se permiten letras");
            return false;
        }
    }
 
    if (id === "num_doc") {
        if (!/^[0-9]+$/.test(valor)) {
            marcarInvalido(input, "Solo números");
            return false;
        }
    }
 
    if (id === "fecha_nac") {
        const fecha = new Date(valor);
        const hoy = new Date();
        const minimo = new Date("1900-01-01");
        if (fecha > hoy) {
            marcarInvalido(input, "No puede ser una fecha futura");
            return false;
        }
        if (fecha < minimo) {
            marcarInvalido(input, "Fecha demasiado antigua");
            return false;
        }

        // Validacion Mayor de Edad
        const edad = hoy.getFullYear() - fecha.getFullYear();
        const cumplioEsteAnio =
            hoy.getMonth() > fecha.getMonth() ||
            (hoy.getMonth() === fecha.getMonth() && hoy.getDate() >= fecha.getDate());
        const edadReal = cumplioEsteAnio ? edad : edad - 1;
        if (edadReal < 18) {
            marcarInvalido(input, "Debés tener al menos 18 años");
            return false;
        }
    }
 
    if (id === "email") {
        const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!regexEmail.test(valor)) {
            marcarInvalido(input, "Formato de email inválido");
            return false;
        }
        //Validacion de Email real
        const lista = JSON.parse(localStorage.getItem("usuariosRegistrados")) || [];
        if (lista.some(u => u.email === valor.toLowerCase())) {
            marcarInvalido(input, "Este email ya está registrado");
            return false;
        }
    }
 
    if (id === "telefono") {
        if (!/^[0-9\+\-\s\(\)]+$/.test(valor)) {
            marcarInvalido(input, "Formato de teléfono inválido");
            return false;
        }
    }
 
    marcarValido(input);
    return true;
}
 
//Validacion del localStorage en Tiempo Real
Object.values(campos).forEach(input => {
    if (!input) return;
 
    input.addEventListener("input", () => {
        input.dataset.touched = "true";
        validarCampo(input);
    });
 
    input.addEventListener("blur", () => {
        input.dataset.touched = "true";
        validarCampo(input);
    });
});
 
//Limpiar y Resetea el Formulario
const btnLimpiar = document.querySelector(".btn-limpiar");
if (btnLimpiar) {
    btnLimpiar.addEventListener("click", () => {
        Object.values(campos).forEach(input => {
            if (input) {
                quitarEstilos(input);
                delete input.dataset.touched;
            }
        });
    });
}
 
//Toggle de Ocultar/Mostrar Contraseña
const togglePass = document.getElementById("togglePassReg");
const inputPass = campos.passwordReg;
if (togglePass && inputPass) {
    togglePass.addEventListener("click", () => {
        const esPassword = inputPass.type === "password";
        inputPass.type = esPassword ? "text" : "password";
        togglePass.textContent = esPassword ? "🙈 Ocultar contraseña" : "👁 Mostrar contraseña";
    });
}
 
//Submit
formRegistro.addEventListener("submit", function (e) {
    e.preventDefault();
 
    let hayErrores = false;
    Object.values(campos).forEach(input => {
        if (!input) return;
        input.dataset.touched = "true";
        if (!validarCampo(input)) hayErrores = true;
    });
 
    if (hayErrores) {
        const nombresErrores = [];
        const mapa = {
            username: "Nombre de Usuario", "password-reg": "Contraseña",
            nombre1: "Nombre 1", apellido: "Apellido", tipo_doc: "Tipo de Documento",
            num_doc: "Número de Documento", fecha_nac: "Fecha de Nacimiento",
            email: "Email", telefono: "Teléfono", direccion: "Dirección",
            cp: "Código Postal", localidad: "Localidad"
        };
        Object.values(campos).forEach(input => {
            if (!input) return;
            const msgEl = input.parentElement.querySelector(".msg-validacion");
            if (msgEl && msgEl.textContent.startsWith("✖")) {
                nombresErrores.push(`<li><b>${mapa[input.id] || input.id}</b></li>`);
            }
        });
 
        Swal.fire({
            icon: "error",
            title: "Campos incorrectos",
            html: `<p style="font-size:1.4rem">Corregí los campos marcados en rojo:</p>
                   <ul style="text-align:left;margin-top:10px;padding-left:20px;font-size:1.3rem">
                     ${nombresErrores.join("")}
                   </ul>`,
            confirmButtonColor: "#e74c3c",
            confirmButtonText: "Entendido"
        });
        return;
    }
 
    //Info para el localStorage
    const username  = campos.username.value.trim();
    const password  = campos.passwordReg.value;
    const nombre1   = campos.nombre1.value.trim();
    const apellido  = campos.apellido.value.trim();
    const numDoc    = campos.numDoc.value.trim();
    const fechaNac  = campos.fechaNac.value;
    const email     = campos.email.value.trim().toLowerCase();
    const localidad = campos.localidad.value.trim();
 
    //Guardar en localStorage
    const listaUsuarios = JSON.parse(localStorage.getItem("usuariosRegistrados")) || [];
    const nuevoUsuario = {
        username, nombre: nombre1, apellido,
        documento: numDoc, email, password, localidad,
        fechaNac
    };
    listaUsuarios.push(nuevoUsuario);
    localStorage.setItem("usuariosRegistrados", JSON.stringify(listaUsuarios));
 
    //Pop Up
    let segundos = 2;
    Swal.fire({
        icon: "success",
        title: "¡Cuenta creada con éxito!",
        html: `<p style="font-size:1.5rem">Redirigiendo al login en <b id="cuenta">${segundos}</b> segundo${segundos !== 1 ? "s" : ""}...</p>`,
        showConfirmButton: false,
        allowOutsideClick: false,
        allowEscapeKey: false,
        timer: segundos * 1000,
        timerProgressBar: true,
        didOpen: () => {
            const intervalo = setInterval(() => {
                segundos--;
                const el = document.getElementById("cuenta");
                if (el) el.textContent = segundos;
                if (segundos <= 0) clearInterval(intervalo);
            }, 1000);
        },
        willClose: () => {
            window.location.href = "./login.html";
        }
    });
});
