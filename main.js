//BDD Local de ciudades disponibles para validación
const ciudadesDisponibles = ["buenos aires", "madrid", "cancun", "rio de janeiro", "roma", "tokio", "maldivias"];
 
// Formulario del Buscador de Vuelos
const formBuscador = document.getElementById("form-buscador");
const inputOrigen = document.getElementById("desde");
const inputDestino = document.getElementById("hacia");
const inputIda = document.getElementById("fecha-ida");
const inputVuelta = document.getElementById("fecha-vuelta");
const selectPasajeros = document.getElementById("pasajeros");
const selectClase = document.getElementById("clase");
 
// Botones del Buscador
const btnIdaVuelta = document.getElementById("btn-ida-vuelta");
const btnSoloIda = document.getElementById("btn-solo-ida");
const contenedorVuelta = document.getElementById("contenedor-vuelta");
let tipoVuelo = "ida-vuelta";
 
// Control de los Botones del Buscador
btnIdaVuelta.addEventListener("click", () => {
    btnIdaVuelta.classList.add("activo");
    btnSoloIda.classList.remove("activo");
    contenedorVuelta.style.display = "flex";
    inputVuelta.required = true;
    tipoVuelo = "ida-vuelta";
});
 
btnSoloIda.addEventListener("click", () => {
    btnSoloIda.classList.add("activo");
    btnIdaVuelta.classList.remove("activo");
    contenedorVuelta.style.display = "none";
    inputVuelta.required = false;
    inputVuelta.value = "";
    quitarEstilosValidacion(inputVuelta);
    tipoVuelo = "solo-ida";
});
 
//Funcion que control si el Usuario esta Logueado o no
function comprobarLoginSilencioso() {
    return sessionStorage.getItem("isLoggedIn") === "true";
}
 
//Pop Up del Login Obligatorio (Es el Pop Up de los 3 botones)
function mostrarModalLoginRequerido() {
    Swal.fire({
        title: '<i class="fa-solid fa-circle-user" style="color: #1E5BFF;"></i> ¡Inicio de sesión requerido!',
        html: '<p style="font-size: 1.4rem;">Para poder buscar vuelos y armar tu próximo viaje, necesitás estar conectado en nuestra plataforma.</p>',
        icon: 'warning',
        showCancelButton: true,
        showDenyButton: true,
        confirmButtonText: '<i class="fa-solid fa-right-to-bracket"></i> Conectarse',
        denyButtonText: '<i class="fa-solid fa-user-plus"></i> Registrarse',
        cancelButtonText: '<i class="fa-solid fa-xmark"></i> Salir',
        confirmButtonColor: '#1E5BFF',
        denyButtonColor: '#2d72d9',
        cancelButtonColor: '#e74c3c',
        allowOutsideClick: false,
        allowEscapeKey: false
    }).then((result) => {
        if (result.isConfirmed) {
            window.location.href = "./pages/registro_&_login/login.html"; // #################### RUTA LOGIN
        } else if (result.isDenied) {
            window.location.href = "./pages/registro_&_login/registro_de_cuenta.html"; // #################### RUTA REGISTRO
        } else if (result.isDismissed) {
            window.location.href = "./index.html"; // #################### RUTA SALIR
        }
    });
}
 
//Funciones de Validacion
function marcarValido(input) {
    if (!input) return;
    input.style.border = "1px solid #2ecc71";
    input.style.boxShadow = "0 0 4px #2ecc71";
    input.style.backgroundColor = "#eafaf1";
 
    const msgEl = document.getElementById("msg-" + input.id);
    if (msgEl) {
        msgEl.textContent = "✔ Campo correcto";
        msgEl.style.color = "#2ecc71";
    }
}
 
function marcarInvalido(input, mensaje) {
    if (!input) return;
    input.style.border = "1px solid #e74c3c";
    input.style.boxShadow = "0 0 4px #e74c3c";
    input.style.backgroundColor = "#fdeaea";
 
    const msgEl = document.getElementById("msg-" + input.id);
    if (msgEl) {
        msgEl.textContent = mensaje || "✖ No cumplís con esta condición";
        msgEl.style.color = "#e74c3c";
    }
}
 
function quitarEstilosValidacion(input) {
    if (!input) return;
    input.style.border = "";
    input.style.boxShadow = "";
    input.style.backgroundColor = "";
 
    const msgEl = document.getElementById("msg-" + input.id);
    if (msgEl) msgEl.textContent = "";
}
 
//Validacion por Campo
function validarCampo(input) {
    if (!input) return true;
 
    const valor = input.value.trim();
    const id = input.id;
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
 
    if (input.required && !valor) {
        marcarInvalido(input, "✖ Este campo es obligatorio");
        return false;
    }
 
    if (id === "desde" || id === "hacia") {
        const regexLetras = /^[a-zA-Z\sñáéíóúÁÉÍÓÚ]+$/;
        if (!regexLetras.test(valor)) {
            marcarInvalido(input, "✖ Solo se permiten letras y espacios");
            return false;
        }

        if (!ciudadesDisponibles.includes(valor.toLowerCase())) {
            marcarInvalido(input, "✖ Ciudad no disponible. Ej: Buenos Aires, Madrid, Tokio...");
            return false;
        }
        if (id === "hacia" && inputOrigen && valor.toLowerCase() === inputOrigen.value.trim().toLowerCase()) {
            marcarInvalido(input, "✖ El destino no puede ser igual al origen");
            return false;
        }
    }
 
    if (id === "fecha-ida" && valor) {
        const fechaIda = new Date(valor);
        if (fechaIda < hoy) {
            marcarInvalido(input, "✖ La fecha de ida no puede ser en el pasado");
            return false;
        }
    }
 
    if (id === "fecha-vuelta" && tipoVuelo === "ida-vuelta" && valor) {
        const fechaIda = inputIda ? new Date(inputIda.value) : null;
        const fechaVuelta = new Date(valor);
        if (fechaVuelta < hoy) {
            marcarInvalido(input, "✖ La fecha de vuelta no puede ser en el pasado");
            return false;
        }
        if (fechaIda && inputIda.value && fechaVuelta < fechaIda) {
            marcarInvalido(input, "✖ La fecha de vuelta debe ser posterior a la de ida");
            return false;
        }
    }
 
    marcarValido(input);
    return true;
}
 
//Validacion en Tiempo Real del Buscador de Vuelos
const camposEntrada = [inputOrigen, inputDestino, inputIda, inputVuelta];
camposEntrada.forEach(input => {
    if (!input) return;
 
    input.addEventListener("input", () => {
        input.dataset.touched = "true";
        if (comprobarLoginSilencioso()) {
            validarCampo(input);
            if (input === inputOrigen && inputDestino && inputDestino.dataset.touched && inputDestino.value) {
                validarCampo(inputDestino);
            }
        }
    });
 
    input.addEventListener("blur", () => {
        input.dataset.touched = "true";
        if (comprobarLoginSilencioso()) {
            validarCampo(input);
        }
    });
});
 
//Recupera la ultima busqueda del sessionStorage
const ultimaBusqueda = JSON.parse(sessionStorage.getItem("ultimaBusqueda"));
 
if (ultimaBusqueda) {
    inputOrigen.value = ultimaBusqueda.origen;
    inputDestino.value = ultimaBusqueda.destino;
    inputIda.value = ultimaBusqueda.fechaIda;
 
    if (ultimaBusqueda.tipoVuelo === "solo-ida") {
        btnSoloIda.click();
    } else {
        btnIdaVuelta.click();
        inputVuelta.value = ultimaBusqueda.fechaVuelta;
    }
 
    selectPasajeros.value = ultimaBusqueda.pasajeros;
    selectClase.value = ultimaBusqueda.clase;
 
    if (comprobarLoginSilencioso()) {
        camposEntrada.forEach(input => {
            if (input && input.value) {
                input.dataset.touched = "true";
                validarCampo(input);
            }
        });
    }
}
 
//Submit
formBuscador.addEventListener("submit", function (e) {
    e.preventDefault();
 
    if (!comprobarLoginSilencioso()) {
        mostrarModalLoginRequerido();
        return;
    }
 
    camposEntrada.forEach(input => { if (input) input.dataset.touched = "true"; });
 
    const esOrigenValido   = validarCampo(inputOrigen);
    const esDestinoValido  = validarCampo(inputDestino);
    const esIdaValido      = validarCampo(inputIda);
    const esVueltaValido   = tipoVuelo === "ida-vuelta" ? validarCampo(inputVuelta) : true;
 
    let errores = [];
    if (!esOrigenValido)  errores.push("<b>Desde (Origen)</b>");
    if (!esDestinoValido) errores.push("<b>Hacia (Destino)</b>");
    if (!esIdaValido)     errores.push("<b>Fecha de Ida</b>");
    if (tipoVuelo === "ida-vuelta" && !esVueltaValido) errores.push("<b>Fecha de Vuelta</b>");
 
    if (errores.length > 0) {
        Swal.fire({
            icon: 'error',
            title: 'Campos incorrectos',
            html: `<p>Por favor, corregí los campos marcados en rojo:</p>
                   <ul style="text-align: left; margin-top: 10px; padding-left: 20px;">
                      ${errores.map(err => `<li>${err}</li>`).join('')}
                   </ul>`,
            confirmButtonColor: '#1E5BFF'
        });
        return;
    }
 
    // Todo válido → guardar búsqueda y redirigir sin ningún alert
    const busquedaUsuario = {
        origen:      inputOrigen.value.trim(),
        destino:     inputDestino.value.trim(),
        fechaIda:    inputIda.value,
        fechaVuelta: tipoVuelo === "ida-vuelta" ? inputVuelta.value : "Solo Ida",
        pasajeros:   selectPasajeros.value,
        clase:       selectClase.value,
        tipoVuelo:   tipoVuelo
    };
 
    // Cada vez que se inicia una búsqueda nueva, se invalida cualquier confirmación previa
    sessionStorage.setItem("ultimaBusqueda", JSON.stringify(busquedaUsuario));
    sessionStorage.removeItem("reservaConfirmada");
    window.location.href = "./pages/resultados-de-busqueda/filtro-1.html";
});
