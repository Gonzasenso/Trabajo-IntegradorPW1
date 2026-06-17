const vueloSeleccionado =
    JSON.parse(
        sessionStorage.getItem(
            "vueloSeleccionado"
        )
    ) || {};

    console.log(vueloSeleccionado);


// ─── Leer sessionStorage ──────────────────────────────────────────────────────
const datosPasajeros = JSON.parse(sessionStorage.getItem("datosPasajeros") || "{}");
const metodoPago     = JSON.parse(sessionStorage.getItem("metodoPago")     || "{}");

const asientos = JSON.parse(
    sessionStorage.getItem("asientosSeleccionados")
) || [];

const resumenVuelo = JSON.parse(
    localStorage.getItem("resumenVuelo")
) || {};

// ─── Mostrar datos de pasajeros ───────────────────────────────────────────────
function renderizarPasajeros() {
  if (!datosPasajeros.total) return;

  const contenedor = document.querySelector(".container-confirmacion-vuelo-ida-vuelta");
  if (!contenedor) return;

  // Crear bloque de pasajeros después del último .vuelo-vuelta
  const vueltaSection = contenedor.querySelector(".vuelo-vuelta");
  if (!vueltaSection) return;

  const bloquePasajeros = document.createElement("section");
  bloquePasajeros.className = "resumen-pasajeros";
  bloquePasajeros.innerHTML = `<h4 class="resumen-pasajeros-titulo">
    <i class="fa-solid fa-users"></i> Pasajero${datosPasajeros.total > 1 ? "s" : ""}
  </h4>`;

  for (let i = 1; i <= datosPasajeros.total; i++) {
    const p = datosPasajeros[`pasajero${i}`];
    if (!p) continue;

    const fila = document.createElement("div");
    fila.className = "resumen-pasajero-fila";
    fila.innerHTML = `
      <div class="resumen-pasajero-nombre">
        <span class="resumen-numero">P${i}</span>
        <strong>${p.nombre} ${p.apellido}</strong>
      </div>
      <div class="resumen-pasajero-detalle">
        <span>${p.tipoDocumento}: ${p.numeroDocumento}</span>
        <span>Nac: ${formatearFecha(p.fechaNacimiento)}</span>
        <span>${p.nacionalidad}</span>
      </div>
      <div class="resumen-pasajero-contacto">
        <span>${p.email}</span>
        <span>${p.telefono}</span>
      </div>
    `;
    bloquePasajeros.appendChild(fila);
  }

  vueltaSection.insertAdjacentElement("afterend", bloquePasajeros);
}


// ─── Mostrar método de pago ───────────────────────────────────────────────────
function renderizarPago() {
  if (!metodoPago.metodo) return;

  const resumen = document.querySelector(".container-resumen");
  if (!resumen) return;

  const etiquetas = {
    credito:       "Tarjeta de crédito",
    debito:        "Tarjeta de débito",
    transferencia: "Transferencia bancaria",
  };

  let detallePago = "";

  if (metodoPago.metodo === "credito" || metodoPago.metodo === "debito") {
    const num = metodoPago.datos.numeroTarjeta || "";
    // Mostrar solo los últimos 4 dígitos
    const ultimos4 = num.replace(/\s/g, "").slice(-4);
    detallePago = `terminada en <strong>•••• ${ultimos4}</strong>`;
    if (metodoPago.metodo === "credito" && metodoPago.datos.cuotas) {
      detallePago += ` — ${metodoPago.datos.cuotas}`;
    }
  } else if (metodoPago.metodo === "transferencia") {
    detallePago = `desde <strong>${metodoPago.datos.banco}</strong>`;
  }

  const filaPago = document.createElement("div");
  filaPago.className = "precio-fila";
  filaPago.innerHTML = `
    <p>Método de pago</p>
    <p>${etiquetas[metodoPago.metodo]} ${detallePago}</p>
  `;

  // Insertar antes del total
  const total = resumen.querySelector(".total");
  if (total) resumen.insertBefore(filaPago, total);
}


// ─── Modal de confirmación ────────────────────────────────────────────────────
function crearModal() {
  const overlay = document.createElement("div");
  overlay.id = "modal-overlay";
  overlay.innerHTML = `
    <div class="modal-box" role="dialog" aria-modal="true" aria-labelledby="modal-titulo">
      <div class="modal-icono"><i class="fa-solid fa-circle-check"></i></div>
      <h3 id="modal-titulo">¿Confirmás tu reserva?</h3>
      <p>Una vez confirmado, recibirás los detalles de tu vuelo por email.</p>
      <div class="modal-botones">
        <button id="modal-cancelar" type="button">Volver</button>
        <button id="modal-confirmar" type="button">Sí, confirmar</button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  // Cerrar con clic fuera del box
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) cerrarModal();
  });

  // Cerrar con Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") cerrarModal();
  });

  document.getElementById("modal-cancelar").addEventListener("click", cerrarModal);
  document.getElementById("modal-confirmar").addEventListener("click", confirmarYRedirigir);
}

function abrirModal() {
  const overlay = document.getElementById("modal-overlay");
  if (overlay) {
    overlay.classList.add("activo");
    document.body.style.overflow = "hidden";
  }
}

function cerrarModal() {
  const overlay = document.getElementById("modal-overlay");
  if (overlay) {
    overlay.classList.remove("activo");
    document.body.style.overflow = "";
  }
}

function confirmarYRedirigir() {
  // Limpiar sessionStorage al finalizar el checkout
  sessionStorage.removeItem("datosPasajeros");
  sessionStorage.removeItem("metodoPago");

  const btnConfirmar = document.querySelector(".confirmar-vuelo a");
  if (btnConfirmar) {
    window.location.href = btnConfirmar.getAttribute("href");
  }
}


// ─── Interceptar el botón "Confirmar vuelo" ───────────────────────────────────
function bindBotonConfirmar() {
  const enlace = document.querySelector(".confirmar-vuelo a");
  if (!enlace) return;

  // Evitar que el <a> navegue directamente
  enlace.addEventListener("click", (e) => {
    e.preventDefault();
    abrirModal();
  });
}


// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatearFecha(fechaISO) {
  if (!fechaISO) return "—";
  const [anio, mes, dia] = fechaISO.split("-");
  return `${dia}/${mes}/${anio}`;
}

// ─── Init ─────────────────────────────────────────────────────────────────────
renderizarPasajeros();
renderizarPago();
renderizarResumenVuelo();
renderizarVueloSeleccionado();
crearModal();
bindBotonConfirmar();

//asientos


const contenedorAsiento =
    document.querySelector(".asiento");

if (contenedorAsiento) {

    contenedorAsiento.innerHTML = `
        <i class="fa-solid fa-couch"></i>
        <p>Asiento${asientos.length > 1 ? "s" : ""} seleccionado${asientos.length > 1 ? "s" : ""}:</p>
        <h5>${asientos.join(", ") || "-"}</h5>
    `;
}


function renderizarResumenVuelo() {
    if (!resumenVuelo.total) return;
    document.getElementById(
        "cantidad-pasajeros"
    ).textContent =
        `${resumenVuelo.pasajeros} ${
            resumenVuelo.pasajeros === 1
                ? "Pasajero"
                : "Pasajeros"
        }`;

    document.getElementById(
        "subtotal-confirmacion"
    ).textContent =
        `USD ${resumenVuelo.tarifa}`;

    document.getElementById(
        "tarifa-confirmacion"
    ).textContent =
        `USD ${resumenVuelo.tarifa}`;

    document.getElementById(
        "impuestos-confirmacion"
    ).textContent =
        `USD ${resumenVuelo.impuestos}`;

    document.getElementById(
        "total-confirmacion"
    ).textContent =
        `Total USD ${resumenVuelo.total}`;
}

function renderizarVueloSeleccionado() {

    if (!vueloSeleccionado.id) return;

    document.getElementById("ruta-vuelo").innerHTML =
        `${vueloSeleccionado.origen} (${vueloSeleccionado.codigoOrigen})
        <i class="fa-solid fa-arrow-right"></i>
        ${vueloSeleccionado.destino} (${vueloSeleccionado.codigoDestino})`;

    document.getElementById("hora-salida").textContent =
        vueloSeleccionado.salida;

    document.getElementById("hora-llegada").textContent =
        vueloSeleccionado.llegada;

    document.getElementById("codigo-origen").textContent =
        vueloSeleccionado.codigoOrigen;

    document.getElementById("codigo-destino").textContent =
        vueloSeleccionado.codigoDestino;

    document.getElementById("nombre-origen").textContent =
        vueloSeleccionado.origen;

    document.getElementById("nombre-destino").textContent =
        vueloSeleccionado.destino;

    document.getElementById("duracion-vuelo").textContent =
        vueloSeleccionado.duracion;

    document.getElementById("logo-aerolinea").src =
        vueloSeleccionado.logo;

        document.getElementById("hora-salida-vuelta").textContent =
    vueloSeleccionado.salida;

document.getElementById("hora-llegada-vuelta").textContent =
    vueloSeleccionado.llegada;

document.getElementById("codigo-origen-vuelta").textContent =
    vueloSeleccionado.codigoDestino;

document.getElementById("codigo-destino-vuelta").textContent =
    vueloSeleccionado.codigoOrigen;

document.getElementById("nombre-origen-vuelta").textContent =
    vueloSeleccionado.destino;

document.getElementById("nombre-destino-vuelta").textContent =
    vueloSeleccionado.origen;

document.getElementById("duracion-vuelta").textContent =
    vueloSeleccionado.duracion;

document.getElementById("logo-aerolinea-vuelta").src =
    vueloSeleccionado.logo;
}