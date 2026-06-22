const datosBusqueda = JSON.parse(
    sessionStorage.getItem("ultimaBusqueda")
);

const cantidadPasajerosBuscada =
    parseInt(datosBusqueda?.pasajeros || 1);

// ─── Constantes ───────────────────────────────────────────────────────────────
const MAX_PASAJEROS = 4;

const NACIONALIDADES = ["Argentina", "Bolivia", "Brasil", "Chile", "Paraguay", "Uruguay"];
const DOCUMENTOS     = ["DNI", "L.E", "L.C", "C.I", "Pasaporte"];

// ─── Estado ───────────────────────────────────────────────────────────────────
let totalPasajeros = 1; // El pasajero 1 siempre existe

// ─── Referencias ──────────────────────────────────────────────────────────────
const form               = document.getElementById("form-pasajeros");
const pasajerosExtra     = document.getElementById("pasajeros-extra");
const btnAgregar         = document.getElementById("btn-agregar-pasajero");
const btnAgregarContainer= document.getElementById("btn-agregar-container");

// ─── Generar HTML de un bloque de pasajero ────────────────────────────────────
function crearBloquePasajero(numero) {
  const opcionesDoc  = DOCUMENTOS.map(d => `<option>${d}</option>`).join("");
  const opcionesNac  = NACIONALIDADES.map(n => `<option>${n}</option>`).join("");

  const bloque = document.createElement("div");
  bloque.className = "pasajero-bloque pasajero-extra";
  bloque.id = `pasajero-${numero}`;
  bloque.innerHTML = `
    <div class="pasajero2-header">
  <h4>Pasajero ${numero}</h4>
  ${
    totalPasajeros > cantidadPasajerosBuscada
      ? `<button type="button" class="btn-eliminar-pasajero" data-numero="${numero}">
          − Eliminar pasajero
        </button>`
      : ""
  }
</div>
    <div class="container-campos">
      <div class="campo-nombre">
        <label>Nombre</label>
        <input type="text" placeholder="Nombre" required>
      </div>
      <div class="campo-apellido">
        <label>Apellido</label>
        <input type="text" placeholder="Apellido" required>
      </div>
      <div class="campo-tipo-documento">
        <label>Tipo de documento</label>
        <select>${opcionesDoc}</select>
      </div>
      <div class="campo-numero-dni">
    <label>Número de documento</label>
    <input
        type="text"
        inputmode="numeric"
        maxlength="8"
        placeholder="12345678"
        required>
</div>
      <div class="campo-fn">
        <label>Fecha de nacimiento</label>
        <input type="date" required>
      </div>
      <div class="campo">
        <label>Nacionalidad</label>
        <select>${opcionesNac}</select>
      </div>
      <div class="campo-email">
        <label>Email</label>
        <input type="email" placeholder="juanperez@email.com" required>
      </div>
      <div class="campo-tel">
        <label>Teléfono</label>
        <input type="tel" inputmode="numeric" placeholder="+54 11 1234 5678" required>
      </div>
    </div>
  `;

  // Validación en tiempo real de los campos del nuevo bloque
  bloque.querySelectorAll("input, select").forEach(campo => {
    campo.addEventListener("blur",  () => validarCampo(campo));
    campo.addEventListener("input", () => limpiarError(campo));
  });

  return bloque;
}

// Limita a 9 digitos el numero de DNI
document.querySelectorAll(".campo-numero-dni input").forEach(input => {
    input.addEventListener("input", () => {
        input.value = input.value
            .replace(/\D/g, "") // solo números
            .slice(0, 8);       // máximo 9 dígitos
    });
});

// ─── Agregar pasajero ─────────────────────────────────────────────────────────
function agregarPasajero() {
  if (totalPasajeros >= cantidadPasajerosBuscada) return;

  totalPasajeros++;
  const bloque = crearBloquePasajero(totalPasajeros);

  // Línea divisoria antes del nuevo bloque
  const hr = document.createElement("hr");
  hr.className = "divisor-pasajero";
  pasajerosExtra.appendChild(hr);
  pasajerosExtra.appendChild(bloque);

  // Scroll suave al nuevo bloque
  bloque.scrollIntoView({ behavior: "smooth", block: "start" });

  actualizarBotonAgregar();
}

// ─── Eliminar pasajero ────────────────────────────────────────────────────────
function eliminarPasajero(bloque) {
  // Eliminar también el <hr> que precede al bloque

  if (cantidadActualPasajeros > cantidadMaxPasajeros) {
    // mostrar botón eliminar
}
  const hr = bloque.previousElementSibling;
  if (hr && hr.classList.contains("divisor-pasajero")) hr.remove();

  bloque.remove();
  totalPasajeros--;

  renumerarPasajeros();
  actualizarBotonAgregar();
}

// ─── Renumerar tras una eliminación ──────────────────────────────────────────
function renumerarPasajeros() {
  const bloques = pasajerosExtra.querySelectorAll(".pasajero-extra");
  bloques.forEach((bloque, i) => {
    const numero = i + 2; // El pasajero 1 siempre es fijo
    bloque.id = `pasajero-${numero}`;
    bloque.querySelector("h4").textContent = `Pasajero ${numero}`;
    bloque.querySelector(".btn-eliminar-pasajero").dataset.numero = numero;
  });
}

// ─── Mostrar u ocultar el botón "Agregar" ────────────────────────────────────
function actualizarBotonAgregar() {
  if (totalPasajeros >= cantidadPasajerosBuscada) {
    btnAgregarContainer.style.display = "none";
  } else {
    btnAgregarContainer.style.display = "block";
  }
}
  

// ─── Validación ───────────────────────────────────────────────────────────────
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

  if (campo.hasAttribute("required") && valor === "") {
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
    if (!/^[\d\s\+\-\(\)]{7,20}$/.test(valor)) {
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

  return true;
}

// Validación en tiempo real para el Pasajero 1 (que está en el HTML estático)
document.querySelectorAll("#pasajero-1 input, #pasajero-1 select").forEach(campo => {
  campo.addEventListener("blur",  () => validarCampo(campo));
  campo.addEventListener("input", () => limpiarError(campo));
});

// ─── Guardar en sessionStorage ────────────────────────────────────────────────
function recolectarPasajero(bloque) {
  return {
    nombre:          bloque.querySelector(".campo-nombre input")?.value.trim()        || "",
    apellido:        bloque.querySelector(".campo-apellido input")?.value.trim()      || "",
    tipoDocumento:   bloque.querySelector(".campo-tipo-documento select")?.value      || "",
    numeroDocumento: bloque.querySelector(".campo-numero-dni input")?.value.trim()    || "",
    fechaNacimiento: bloque.querySelector(".campo-fn input")?.value                   || "",
    nacionalidad:    bloque.querySelector(".campo select")?.value                     || "",
    email:           bloque.querySelector(".campo-email input")?.value.trim()         || "",
    telefono:        bloque.querySelector(".campo-tel input")?.value.trim()           || "",
  };
}

function guardarEnSession() {
  const datos = {};

  // Pasajero 1
  datos["pasajero1"] = recolectarPasajero(document.getElementById("pasajero-1"));

  // Pasajeros extra (2, 3, 4)
  pasajerosExtra.querySelectorAll(".pasajero-extra").forEach((bloque, i) => {
    datos[`pasajero${i + 2}`] = recolectarPasajero(bloque);
  });

  datos.total = totalPasajeros;
  sessionStorage.setItem("datosPasajeros", JSON.stringify(datos));
}

// ─── Submit ───────────────────────────────────────────────────────────────────
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const todosLosCampos = form.querySelectorAll("input, select");
  const resultados = [...todosLosCampos].map(c => validarCampo(c));
  const todosValidos = resultados.every(Boolean);

  if (!todosValidos) {
    const primerError = form.querySelector(".campo-error");
    if (primerError) primerError.scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }

if (totalPasajeros !== cantidadPasajerosBuscada) {

    const faltantes = [];

    for (let i = totalPasajeros + 1; i <= cantidadPasajerosBuscada; i++) {
        faltantes.push(i);
    }

    let mensaje = "";

    if (faltantes.length === 1) {
        mensaje =
            `Para continuar, debés completar los datos del pasajero ${faltantes[0]}.`;
    } else {
        mensaje =
            `Para continuar, debés completar los datos de los pasajeros ${faltantes.join(", ")}.`;
    }

    document.getElementById("mensaje-pasajeros").textContent = mensaje;

    return;
}

document.getElementById("mensaje-pasajeros").textContent = "";

guardarEnSession();
window.location.href = form.getAttribute("action");

guardarEnSession();
window.location.href = form.getAttribute("action");
});

// ─── Evento del botón agregar ─────────────────────────────────────────────────
btnAgregar.addEventListener("click", agregarPasajero);


function cargarDatosGuardados() {
  const datosGuardados = JSON.parse(sessionStorage.getItem("datosPasajeros"));

  if (!datosGuardados) return;

  for (let i = 2; i <= datosGuardados.total; i++) {
    agregarPasajero();
  }

  Object.keys(datosGuardados).forEach(clave => {
    if (clave.startsWith("pasajero")) {
      const numero = clave.replace("pasajero", "");
      const bloque = document.getElementById(`pasajero-${numero}`);
      const datos = datosGuardados[clave];

      if (bloque && datos) {
        bloque.querySelector(".campo-nombre input").value = datos.nombre;
        bloque.querySelector(".campo-apellido input").value = datos.apellido;
        bloque.querySelector(".campo-tipo-documento select").value = datos.tipoDocumento;
        bloque.querySelector(".campo-numero-dni input").value = datos.numeroDocumento;
        bloque.querySelector(".campo-fn input").value = datos.fechaNacimiento;
        bloque.querySelector(".campo select").value = datos.nacionalidad;
        bloque.querySelector(".campo-email input").value = datos.email;
        bloque.querySelector(".campo-tel input").value = datos.telefono;
      }
    }
  });
}

btnAgregar.addEventListener("click", agregarPasajero);
cargarDatosGuardados();