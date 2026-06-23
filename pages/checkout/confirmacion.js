// Lee los sessionStorage / localStorage
const vueloSeleccionado = JSON.parse(sessionStorage.getItem("vueloSeleccionado")) || {};
const datosBusqueda     = JSON.parse(sessionStorage.getItem("ultimaBusqueda"))    || {};
const datosPasajeros    = JSON.parse(sessionStorage.getItem("datosPasajeros")     || "{}");
const metodoPago        = JSON.parse(sessionStorage.getItem("metodoPago")         || "{}");
const resumenVuelo      = JSON.parse(localStorage.getItem("resumenVuelo"))        || {};

//Lectura de los Asientos
const asientosRaw  = JSON.parse(sessionStorage.getItem("asientosSeleccionados")) || {};
const asientosIda    = Array.isArray(asientosRaw.ida)    ? asientosRaw.ida    : [];
const asientosVuelta = Array.isArray(asientosRaw.vuelta) ? asientosRaw.vuelta : [];
const esIdaVuelta = datosBusqueda.tipoVuelo === "ida-vuelta";
 
//Funcion de Asientos Seleccionados
function renderizarAsientos() {
    const el = document.getElementById("asientos-confirmacion");
    if (!el) return;
 
    if (asientosIda.length === 0 && asientosVuelta.length === 0) {
        el.textContent = "–";
        return;
    }
 
    let texto = "";
 
    if (asientosIda.length > 0) {
        texto += `Ida: ${asientosIda.join(", ")}`;
    }
 
    if (esIdaVuelta && asientosVuelta.length > 0) {
        texto += texto ? "   |   " : "";
        texto += `Vuelta: ${asientosVuelta.join(", ")}`;
    }
 
    el.textContent = texto || "–";
}
 
//Funcion de Informacion de Vuelo
function renderizarVueloSeleccionado() {
    if (!vueloSeleccionado.id) return;
 
    // Ruta en el encabezado
    document.getElementById("ruta-vuelo").innerHTML =
        `${vueloSeleccionado.origen} (${vueloSeleccionado.codigoOrigen})
        <i class="fa-solid fa-arrow-right"></i>
        ${vueloSeleccionado.destino} (${vueloSeleccionado.codigoDestino})`;
 
    // Vuelo de ida
    document.getElementById("hora-salida").textContent   = vueloSeleccionado.salida;
    document.getElementById("hora-llegada").textContent  = vueloSeleccionado.llegada;
    document.getElementById("codigo-origen").textContent = vueloSeleccionado.codigoOrigen;
    document.getElementById("codigo-destino").textContent= vueloSeleccionado.codigoDestino;
    document.getElementById("nombre-origen").textContent = vueloSeleccionado.origen;
    document.getElementById("nombre-destino").textContent= vueloSeleccionado.destino;
    document.getElementById("duracion-vuelo").textContent= vueloSeleccionado.duracion;
    document.getElementById("logo-aerolinea").src        = vueloSeleccionado.logo;
 
    // Vuelo de vuelta (Si el vuelo es "Solo ida, esto se oculta automaticamente")
    const seccionVuelta = document.getElementById("seccion-vuelta");
    if (!esIdaVuelta) {
        if (seccionVuelta) seccionVuelta.style.display = "none";
    } else {
        document.getElementById("hora-salida-vuelta").textContent    = vueloSeleccionado.salida;
        document.getElementById("hora-llegada-vuelta").textContent   = vueloSeleccionado.llegada;
        document.getElementById("codigo-origen-vuelta").textContent  = vueloSeleccionado.codigoDestino;
        document.getElementById("codigo-destino-vuelta").textContent = vueloSeleccionado.codigoOrigen;
        document.getElementById("nombre-origen-vuelta").textContent  = vueloSeleccionado.destino;
        document.getElementById("nombre-destino-vuelta").textContent = vueloSeleccionado.origen;
        document.getElementById("duracion-vuelta").textContent       = vueloSeleccionado.duracion;
        document.getElementById("logo-aerolinea-vuelta").src         = vueloSeleccionado.logo;
    }
}

function renderizarResumenVuelo() {
    if (!resumenVuelo.total) return;
 
    const descuento = parseInt(sessionStorage.getItem("descuentoAplicado") || "0");
    const totalFinal = resumenVuelo.total - descuento;
 
    document.getElementById("cantidad-pasajeros").textContent =
        `${resumenVuelo.pasajeros} ${resumenVuelo.pasajeros === 1 ? "Pasajero" : "Pasajeros"}`;
 
    document.getElementById("subtotal-confirmacion").textContent =
        `USD ${resumenVuelo.tarifa.toLocaleString("es-AR")}`;
 
    document.getElementById("tarifa-confirmacion").textContent =
        `USD ${resumenVuelo.tarifa.toLocaleString("es-AR")}`;
 
    document.getElementById("impuestos-confirmacion").textContent =
        `USD ${resumenVuelo.impuestos.toLocaleString("es-AR")}`;
 
    document.getElementById("total-confirmacion").textContent =
        `Total USD ${totalFinal.toLocaleString("es-AR")}`;
 
    if (descuento > 0) {
        const resumenEl  = document.querySelector(".container-resumen");
        const totalEl    = resumenEl?.querySelector(".total");
        if (resumenEl && totalEl) {
            const filaDescuento = document.createElement("div");
            filaDescuento.className = "precio-fila";
            filaDescuento.innerHTML = `
                <p>Descuento aplicado</p>
                <p style="color:#16a34a;">- USD ${descuento.toLocaleString("es-AR")}</p>
            `;
            resumenEl.insertBefore(filaDescuento, totalEl);
        }
    }
}
 
//Datos en los Forms
function renderizarPasajeros() {
    if (!datosPasajeros.total) return;
 
    const contenedor = document.querySelector(".container-confirmacion-vuelo-ida-vuelta");
    if (!contenedor) return;
 
    // Insertar después de .vuelo-vuelta si existe, o después de .vuelo-ida como fallback
    const ancla = contenedor.querySelector("#seccion-vuelta") ||
                  contenedor.querySelector(".vuelo-ida");
    if (!ancla) return;
 
    const bloquePasajeros = document.createElement("section");
    bloquePasajeros.className = "resumen-pasajeros";
    bloquePasajeros.innerHTML = `
        <h4 class="resumen-pasajeros-titulo">
            <i class="fa-solid fa-users"></i>
            Pasajero${datosPasajeros.total > 1 ? "s" : ""}
        </h4>
    `;
 
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
 
    ancla.insertAdjacentElement("afterend", bloquePasajeros);
}
 
//Pago en el resumen
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
 
    const totalEl = resumen.querySelector(".total");
    if (totalEl) resumen.insertBefore(filaPago, totalEl);
}
 
//Pop Up Confirmacion
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
 
    overlay.addEventListener("click", e => {
        if (e.target === overlay) cerrarModal();
    });
 
    document.addEventListener("keydown", e => {
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
 
//Funcion de Confirmar y Redirigir
function confirmarYRedirigir() {
  // Persistir el precio final calculado en detalles.js antes de limpiar la sesión, para que reservas.js lo pueda leer directamente sin recalcular. 
    const descuento = parseInt(sessionStorage.getItem("descuentoAplicado") || "0");
    const resumenLocal = JSON.parse(localStorage.getItem("resumenVuelo") || "null");
    const busqueda     = JSON.parse(sessionStorage.getItem("ultimaBusqueda") || "{}");

    let totalFinal;
    
    if (resumenLocal && resumenLocal.total) {
        totalFinal = resumenLocal.total - descuento;
    } else {
        // Fallback con la misma lógica de detalles.js
        const vuelo       = JSON.parse(sessionStorage.getItem("vueloSeleccionado") || "{}");
        const esIdaVuelta = busqueda.tipoVuelo === "ida-vuelta";
        const pasajeros   = parseInt(busqueda.pasajeros, 10) || 1;
        const clase       = (busqueda.clase || "economica").toLowerCase();

        let precioBase = parseFloat(vuelo.precio) || 0;
        if (clase === "business") precioBase *= 1.5;
        else if (clase === "first")    precioBase *= 2;
        if (esIdaVuelta) precioBase *= 2;

        const tarifa    = Math.round(precioBase * pasajeros);
        const impuestos = (esIdaVuelta ? 180 : 90) * pasajeros;
        const equipaje  = busqueda.equipajeIncluido ? 100 * pasajeros : 0;
        totalFinal = tarifa + impuestos + equipaje - descuento;
    }
    busqueda.precioFinalTotal = totalFinal;
    sessionStorage.setItem("ultimaBusqueda", JSON.stringify(busqueda));
    
    sessionStorage.setItem("reservaConfirmada", "true");
    sessionStorage.removeItem("datosPasajeros");
    sessionStorage.removeItem("metodoPago");
    sessionStorage.removeItem("borradorPago");
    sessionStorage.removeItem("asientosSeleccionados");
    sessionStorage.removeItem("descuentoAplicado");

    const enlace = document.querySelector(".confirmar-vuelo a");
    if (enlace) window.location.href = enlace.getAttribute("href");
}
 
//Boton de Confirmar Vuelo
function bindBotonConfirmar() {
    const enlace = document.querySelector(".confirmar-vuelo a");
    if (!enlace) return;
    enlace.addEventListener("click", e => {
        e.preventDefault();
        abrirModal();
    });
}

function formatearFecha(fechaISO) {
    if (!fechaISO) return "—";
    const [anio, mes, dia] = fechaISO.split("-");
    return `${dia}/${mes}/${anio}`;
}

renderizarVueloSeleccionado();
renderizarAsientos();
renderizarResumenVuelo();
renderizarPasajeros();
renderizarPago();
crearModal();
bindBotonConfirmar();