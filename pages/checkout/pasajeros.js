// ─── Datos de la búsqueda ─────────────────────────────────────────────────────
const datosBusqueda = JSON.parse(sessionStorage.getItem("ultimaBusqueda"));
const cantidadPasajerosBuscada = parseInt(datosBusqueda?.pasajeros || 1);
 
// ─── Constantes ───────────────────────────────────────────────────────────────
const MAX_PASAJEROS = 4;
const NACIONALIDADES = ["Argentina", "Bolivia", "Brasil", "Chile", "Paraguay", "Uruguay"];
const DOCUMENTOS = ["DNI", "L.E", "L.C", "C.I", "Pasaporte"];
 
// ─── Estado ───────────────────────────────────────────────────────────────────
let totalPasajeros = 1;
 
// ─── Referencias ──────────────────────────────────────────────────────────────
const form                = document.getElementById("form-pasajeros");
const pasajerosExtra      = document.getElementById("pasajeros-extra");
const btnAgregar          = document.getElementById("btn-agregar-pasajero");
const btnAgregarContainer = document.getElementById("btn-agregar-container");
const btnCancelar         = document.getElementById("btn-cancelar");
 
// ─── Botón Cancelar ───────────────────────────────────────────────────────────
if (btnCancelar) {
    btnCancelar.addEventListener("click", () => {
        window.location.href = "../../index.html";
    });
}
 
// ─── Autocompletado desde Perfil ─────────────────────────────────────────────
document.getElementById("btn-autocompletar")?.addEventListener("click", function () {
    const isLoggedIn = sessionStorage.getItem("isLoggedIn") === "true";
 
    // Si no hay sesión activa, avisamos y no hacemos nada
    if (!isLoggedIn) {
        Swal.fire({
            icon: "info",
            title: "No estás conectado",
            html: `<p style="font-size:1.5rem">Iniciá sesión para poder usar tus datos de perfil.</p>`,
            confirmButtonText: "Entendido",
            confirmButtonColor: "#1266d6",
        });
        return;
    }
 
    const userName = sessionStorage.getItem("userName");
    const listaUsuarios = JSON.parse(localStorage.getItem("usuariosRegistrados")) || [];
    const datosUsuario = listaUsuarios.find(
        u => u.username && u.username.toLowerCase() === userName.toLowerCase()
    );
 
    if (!datosUsuario) {
        Swal.fire({
            icon: "warning",
            title: "No se encontraron datos",
            html: `<p style="font-size:1.5rem">No pudimos encontrar tu información de perfil guardada.</p>`,
            confirmButtonText: "Cerrar",
            confirmButtonColor: "#1266d6",
        });
        return;
    }
 
    const bloque = document.getElementById("pasajero-1");
 
    // Nombre
    const inputNombre = bloque.querySelector(".campo-nombre input");
    if (inputNombre && datosUsuario.nombre) {
        inputNombre.value = datosUsuario.nombre;
        limpiarError(inputNombre);
    }
 
    // Apellido
    const inputApellido = bloque.querySelector(".campo-apellido input");
    if (inputApellido && datosUsuario.apellido) {
        inputApellido.value = datosUsuario.apellido;
        limpiarError(inputApellido);
    }
 
    // Número de documento
    const inputDoc = bloque.querySelector(".campo-numero-dni input");
    if (inputDoc && datosUsuario.documento) {
        // Solo los primeros 8 caracteres numéricos (mismo límite que el campo)
        inputDoc.value = String(datosUsuario.documento).replace(/\D/g, "").slice(0, 8);
        limpiarError(inputDoc);
    }
 
    // Email
    const inputEmail = bloque.querySelector(".campo-email input");
    if (inputEmail && datosUsuario.email) {
        inputEmail.value = datosUsuario.email;
        limpiarError(inputEmail);
    }
  
    Swal.fire({
        icon: "success",
        title: "Datos cargados",
        html: `<p style="font-size:1.5rem">
                   Se completaron los campos disponibles de tu perfil.<br>
                   Revisá y completá los datos que faltan.
               </p>`,
        confirmButtonText: "Continuar",
        confirmButtonColor: "#1266d6",
        timer: 3000,
        timerProgressBar: true,
    });
});
 
// ─── Generar HTML de un bloque de pasajero extra ──────────────────────────────
function crearBloquePasajero(numero) {
    const opcionesDoc = DOCUMENTOS.map(d => `<option>${d}</option>`).join("");
    const opcionesNac = NACIONALIDADES.map(n => `<option>${n}</option>`).join("");
 
    const bloque = document.createElement("div");
    bloque.className = "pasajero-bloque pasajero-extra";
    bloque.id = `pasajero-${numero}`;
    bloque.innerHTML = `
        <div class="pasajero2-header">
            <h4>Pasajero ${numero}</h4>
            <button type="button" class="btn-eliminar-pasajero" data-numero="${numero}">
                − Eliminar pasajero
            </button>
        </div>
        <div class="container-campos">
            <div class="campo-nombre">
                <label>Nombre</label>
                <input type="text" placeholder="Nombre" autocomplete="off">
            </div>
            <div class="campo-apellido">
                <label>Apellido</label>
                <input type="text" placeholder="Apellido" autocomplete="off">
            </div>
            <div class="campo-tipo-documento">
                <label>Tipo de documento</label>
                <select>${opcionesDoc}</select>
            </div>
            <div class="campo-numero-dni">
                <label>Número de documento</label>
                <input type="text" inputmode="numeric" maxlength="8" placeholder="12345678" autocomplete="off">
            </div>
            <div class="campo-fn">
                <label>Fecha de nacimiento</label>
                <input type="date">
            </div>
            <div class="campo">
                <label>Nacionalidad</label>
                <select>${opcionesNac}</select>
            </div>
            <div class="campo-email">
                <label>Email</label>
                <input type="email" placeholder="juanperez@email.com" autocomplete="off">
            </div>
            <div class="campo-tel">
                <label>Teléfono</label>
                <input type="tel" inputmode="numeric" placeholder="+54 11 1234 5678" autocomplete="off">
            </div>
        </div>
    `;
 
    // Validación en tiempo real
    bloque.querySelectorAll("input, select").forEach(campo => {
        campo.addEventListener("blur",  () => validarCampo(campo));
        campo.addEventListener("input", () => {
            limpiarError(campo);
            // Límite numérico para DNI dentro del bloque extra
            if (campo.closest(".campo-numero-dni")) {
                campo.value = campo.value.replace(/\D/g, "").slice(0, 8);
            }
        });
    });
 
    return bloque;
}
 
// ─── Límite numérico DNI en Pasajero 1 (HTML estático) ───────────────────────
document.querySelector("#pasajero-1 .campo-numero-dni input")?.addEventListener("input", function () {
    this.value = this.value.replace(/\D/g, "").slice(0, 8);
});
 
// ─── Agregar pasajero ─────────────────────────────────────────────────────────
function agregarPasajero() {
    if (totalPasajeros >= cantidadPasajerosBuscada) return;
 
    totalPasajeros++;
    const bloque = crearBloquePasajero(totalPasajeros);
 
    const hr = document.createElement("hr");
    hr.className = "divisor-pasajero";
    pasajerosExtra.appendChild(hr);
    pasajerosExtra.appendChild(bloque);
 
    bloque.scrollIntoView({ behavior: "smooth", block: "start" });
    actualizarBotonAgregar();
}
 
// ─── Eliminar pasajero ────────────────────────────────────────────────────────
function eliminarPasajero(bloque) {
    const hr = bloque.previousElementSibling;
    if (hr && hr.classList.contains("divisor-pasajero")) hr.remove();
    bloque.remove();
    totalPasajeros--;
    renumerarPasajeros();
    actualizarBotonAgregar();
}
 
// ─── Renumerar tras eliminación ───────────────────────────────────────────────
function renumerarPasajeros() {
    const bloques = pasajerosExtra.querySelectorAll(".pasajero-extra");
    bloques.forEach((bloque, i) => {
        const numero = i + 2;
        bloque.id = `pasajero-${numero}`;
        bloque.querySelector("h4").textContent = `Pasajero ${numero}`;
        const btnElim = bloque.querySelector(".btn-eliminar-pasajero");
        if (btnElim) btnElim.dataset.numero = numero;
    });
}
 
// ─── Mostrar / ocultar el botón "Agregar" ────────────────────────────────────
function actualizarBotonAgregar() {
    btnAgregarContainer.style.display =
        totalPasajeros >= cantidadPasajerosBuscada ? "none" : "block";
}
 
// ─── Delegación de eventos para "Eliminar pasajero" ──────────────────────────
pasajerosExtra.addEventListener("click", function (e) {
    const btn = e.target.closest(".btn-eliminar-pasajero");
    if (!btn) return;
    const bloque = btn.closest(".pasajero-extra");
    if (bloque) eliminarPasajero(bloque);
});
 
// ─── Validación individual de campos ─────────────────────────────────────────
function marcarError(campo, mensaje) {
    campo.classList.add("campo-error");
    let msgEl = campo.parentElement.querySelector(".mensaje-error");
    if (!msgEl) {
        msgEl = document.createElement("span");
        msgEl.className = "mensaje-error";
        campo.parentElement.appendChild(msgEl);
    }
    msgEl.textContent = mensaje;
}
 
function limpiarError(campo) {
    campo.classList.remove("campo-error");
    const msgEl = campo.parentElement.querySelector(".mensaje-error");
    if (msgEl) msgEl.remove();
}
 
function validarCampo(campo) {
    const valor = campo.value.trim();
    limpiarError(campo);
 
    // Campos obligatorios (todos excepto los select, que siempre tienen valor)
    if (campo.tagName === "INPUT" && valor === "") {
        marcarError(campo, "Este campo es obligatorio.");
        return false;
    }
 
    if (campo.type === "email" && valor !== "") {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor)) {
            marcarError(campo, "Ingresá un email válido.");
            return false;
        }
    }
 
    if (campo.type === "tel" && valor !== "") {
        if (!/^[\d\s+\-()]{7,20}$/.test(valor)) {
            marcarError(campo, "Ingresá un teléfono válido.");
            return false;
        }
    }
 
    if (campo.type === "date" && valor !== "") {
        if (new Date(valor) >= new Date()) {
            marcarError(campo, "La fecha debe ser anterior a hoy.");
            return false;
        }
    }
 
    if (campo.closest(".campo-numero-dni") && valor !== "") {
        if (!/^\d{7,8}$/.test(valor)) {
            marcarError(campo, "Ingresá un número de documento válido (7 u 8 dígitos).");
            return false;
        }
    }
 
    return true;
}
 
//Validación en tiempo real para Pasajero 1
document.querySelectorAll("#pasajero-1 input, #pasajero-1 select").forEach(campo => {
    campo.addEventListener("blur",  () => validarCampo(campo));
    campo.addEventListener("input", () => limpiarError(campo));
});
 
//Recoleccion datos de bloques
function recolectarPasajero(bloque) {
    return {
        nombre:          bloque.querySelector(".campo-nombre input")?.value.trim()     || "",
        apellido:        bloque.querySelector(".campo-apellido input")?.value.trim()   || "",
        tipoDocumento:   bloque.querySelector(".campo-tipo-documento select")?.value   || "",
        numeroDocumento: bloque.querySelector(".campo-numero-dni input")?.value.trim() || "",
        fechaNacimiento: bloque.querySelector(".campo-fn input")?.value                || "",
        nacionalidad:    bloque.querySelector(".campo select")?.value                  || "",
        email:           bloque.querySelector(".campo-email input")?.value.trim()      || "",
        telefono:        bloque.querySelector(".campo-tel input")?.value.trim()        || "",
    };
}
 
function guardarEnSession() {
    const datos = {};
    datos["pasajero1"] = recolectarPasajero(document.getElementById("pasajero-1"));
    pasajerosExtra.querySelectorAll(".pasajero-extra").forEach((bloque, i) => {
        datos[`pasajero${i + 2}`] = recolectarPasajero(bloque);
    });
    datos.total = totalPasajeros;
    sessionStorage.setItem("datosPasajeros", JSON.stringify(datos));
}
 
//Submit
form.addEventListener("submit", function (e) {
    e.preventDefault();
 
    // 1. Validar todos los inputs
    const todosLosCampos = form.querySelectorAll("input, select");
    const resultados = [...todosLosCampos].map(c => validarCampo(c));
    const todosValidos = resultados.every(Boolean);
 
    if (!todosValidos) {
        const primerError = form.querySelector(".campo-error");
        if (primerError) primerError.scrollIntoView({ behavior: "smooth", block: "center" });
 
        Swal.fire({
            icon: "error",
            title: "Hay campos incompletos",
            html: `<p style="font-size:1.5rem">Revisá los campos marcados en rojo antes de continuar.</p>`,
            confirmButtonText: "Revisar",
            confirmButtonColor: "#1266d6",
        });
        return;
    }
 
    // 2. Verificar que estén todos los pasajeros requeridos
    if (totalPasajeros !== cantidadPasajerosBuscada) {
        const faltantes = [];
        for (let i = totalPasajeros + 1; i <= cantidadPasajerosBuscada; i++) {
            faltantes.push(i);
        }
 
        const listado = faltantes.length === 1
            ? `el pasajero ${faltantes[0]}`
            : `los pasajeros ${faltantes.join(", ")}`;
 
        Swal.fire({
            icon: "warning",
            title: "Faltan pasajeros",
            html: `<p style="font-size:1.5rem">
                       Tu búsqueda incluye <b>${cantidadPasajerosBuscada} pasajero${cantidadPasajerosBuscada > 1 ? "s" : ""}</b>.<br>
                       Completá los datos de ${listado} antes de continuar.
                   </p>`,
            confirmButtonText: "Agregar pasajeros",
            confirmButtonColor: "#1266d6",
        });
        return;
    }
 
    // 3. Todo OK → guardar y avanzar
    document.getElementById("mensaje-pasajeros").textContent = "";
    guardarEnSession();
    window.location.href = form.getAttribute("action");
});
 
btnAgregar.addEventListener("click", agregarPasajero);
actualizarBotonAgregar();
 
//Restaura los datos al retroceder entre hojas
function cargarDatosGuardados() {
    const datosGuardados = JSON.parse(sessionStorage.getItem("datosPasajeros"));
    if (!datosGuardados) return;
 
    // Recrear los bloques extra antes de rellenar
    for (let i = 2; i <= datosGuardados.total; i++) {
        agregarPasajero();
    }
 
    Object.keys(datosGuardados).forEach(clave => {
        if (!clave.startsWith("pasajero")) return;
        const numero = clave.replace("pasajero", "");
        const bloque = document.getElementById(`pasajero-${numero}`);
        const datos  = datosGuardados[clave];
        if (!bloque || !datos) return;
 
        bloque.querySelector(".campo-nombre input").value          = datos.nombre          || "";
        bloque.querySelector(".campo-apellido input").value        = datos.apellido        || "";
        bloque.querySelector(".campo-tipo-documento select").value = datos.tipoDocumento   || "";
        bloque.querySelector(".campo-numero-dni input").value      = datos.numeroDocumento || "";
        bloque.querySelector(".campo-fn input").value              = datos.fechaNacimiento || "";
        bloque.querySelector(".campo select").value                = datos.nacionalidad    || "";
        bloque.querySelector(".campo-email input").value           = datos.email          || "";
        bloque.querySelector(".campo-tel input").value             = datos.telefono        || "";
    });
}
 
cargarDatosGuardados();
