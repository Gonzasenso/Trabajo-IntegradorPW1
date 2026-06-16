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
      <button type="button" class="btn-eliminar-pasajero" data-numero="${numero}">− Eliminar pasajero</button>
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
        <input type="text" inputmode="numeric" placeholder="1234568" required>
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

  // Evento eliminar
  bloque.querySelector(".btn-eliminar-pasajero").addEventListener("click", () => {
    eliminarPasajero(bloque);
  });

  // Validación en tiempo real de los campos del nuevo bloque
  bloque.querySelectorAll("input, select").forEach(campo => {
    campo.addEventListener("blur",  () => validarCampo(campo));
    campo.addEventListener("input", () => limpiarError(campo));
  });

  return bloque;
}

// ─── Agregar pasajero ─────────────────────────────────────────────────────────
function agregarPasajero() {
  if (totalPasajeros >= MAX_PASAJEROS) return;

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
  if (totalPasajeros >= MAX_PASAJEROS) {
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

  guardarEnSession();
  window.location.href = form.getAttribute("action");
});

// ─── Evento del botón agregar ─────────────────────────────────────────────────
btnAgregar.addEventListener("click", agregarPasajero);