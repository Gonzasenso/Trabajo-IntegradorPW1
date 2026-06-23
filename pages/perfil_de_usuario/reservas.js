/* #region Catálogo de vuelos */
const catalogoVuelos = [
    {
        id: 1,
        origen: "Buenos Aires",
        destino: "Madrid",
        codigoOrigen: "EZE",
        codigoDestino: "MAD",
        aerolinea: "Air Europa",
        tipo: "2 o mas escalas",
        salida: "08:30",
        llegada: "19:45",
        duracion: "11h 15m",
        precio: 900,
    },
    {
        id: 2,
        origen: "Buenos Aires",
        destino: "Madrid",
        codigoOrigen: "EZE",
        codigoDestino: "MAD",
        aerolinea: "Iberia",
        tipo: "Directo",
        salida: "12:30",
        llegada: "23:45",
        duracion: "13h 15m",
        precio: 1000,
    },
    {
        id: 3,
        origen: "Buenos Aires",
        destino: "Cancun",
        codigoOrigen: "EZE",
        codigoDestino: "CUN",
        aerolinea: "LATAM",
        tipo: "2 o mas escalas",
        salida: "17:00",
        llegada: "04:15",
        duracion: "11h 15m",
        precio: 700,
    },
    {
        id: 4,
        origen: "Buenos Aires",
        destino: "Rio de Janeiro",
        codigoOrigen: "EZE",
        codigoDestino: "GIG",
        aerolinea: "LATAM",
        tipo: "1 escala",
        salida: "09:30",
        llegada: "12:10",
        duracion: "2h 40m",
        precio: 280,
    },
    {
        id: 5,
        origen: "Buenos Aires",
        destino: "Roma",
        codigoOrigen: "EZE",
        codigoDestino: "FCO",
        aerolinea: "Iberia",
        tipo: "1 escala",
        salida: "11:20",
        llegada: "05:50",
        duracion: "14h 30m",
        precio: 740,
    },
    {
        id: 6,
        origen: "Buenos Aires",
        destino: "Tokio",
        codigoOrigen: "EZE",
        codigoDestino: "HND",
        aerolinea: "LATAM",
        tipo: "2 o mas escalas",
        salida: "08:00",
        llegada: "14:30",
        duracion: "28h 30m",
        precio: 1200,
    },
    {
        id: 7,
        origen: "Buenos Aires",
        destino: "Maldivias",
        codigoOrigen: "EZE",
        codigoDestino: "MLE",
        aerolinea: "Iberia",
        tipo: "1 escala",
        salida: "22:15",
        llegada: "23:50",
        duracion: "22h 35m",
        precio: 1890,
    }
];
/* #endregion */
 
 
/* #region Utilidades */
 
/** Pone la primera letra en mayúscula. */
function capitalizar(str = "") {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
 
/** Calcula el precio final según clase, pasajeros y equipaje. */
function calcularPrecioFinal(precioBase, busqueda) {
    let precio = precioBase;
    if (busqueda.clase === "business") precio *= 1.5;
    if (busqueda.clase === "first")    precio *= 2;
    precio *= Number(busqueda.pasajeros);
    if (busqueda.equipajeIncluido)     precio += 100 * Number(busqueda.pasajeros);
    return Math.round(precio);
}
 
/** Busca en el catálogo el vuelo que mejor coincide con origen y destino. */
function buscarVueloCatalogo(origen, destino) {
    return catalogoVuelos.find(
        v =>
            v.origen.toLowerCase()  === origen.toLowerCase() &&
            v.destino.toLowerCase() === destino.toLowerCase()
    ) || null;
}
/* #endregion */
 
 
/* #region Construcción y persistencia de reservas */
function construirReservaDesdeSesion() {
    const confirmada = sessionStorage.getItem("reservaConfirmada");
    if (confirmada !== "true") return null;
 
    const raw = sessionStorage.getItem("ultimaBusqueda");
    if (!raw) return null;
 
    try {
        const datos = JSON.parse(raw);
        const vuelo = buscarVueloCatalogo(datos.origen, datos.destino);
        const precioFinal = datos.precioFinalTotal ? Math.round(datos.precioFinalTotal) : (vuelo ? calcularPrecioFinal(vuelo.precio, datos) : null);
 
        return {
            id:            `${datos.origen}-${datos.destino}-${datos.fechaIda}`.toLowerCase().replace(/\s/g, ""),
            origen:        capitalizar(datos.origen),
            destino:       capitalizar(datos.destino),
            fechaIda:      datos.fechaIda,
            fechaVuelta:   datos.fechaVuelta !== "Solo Ida" ? datos.fechaVuelta : null,
            pasajeros:     datos.pasajeros,
            clase:         capitalizar(datos.clase),
            tipoVuelo:     datos.tipoVuelo,
            salidaIda:     vuelo?.salida          || "—",
            llegadaIda:    vuelo?.llegada         || "—",
            duracionIda:   vuelo?.duracion        || "—",
            codigoOrigen:  vuelo?.codigoOrigen    || "—",
            codigoDestino: vuelo?.codigoDestino   || "—",
            aerolinea:     vuelo?.aerolinea       || "—",
            precio:        precioFinal,
        };
    } catch (e) {
        console.warn("Error al parsear ultimaBusqueda:", e);
        return null;
    }
}
 
/** Lee el historial acumulado de reservas desde localStorage. */
function leerHistorial() {
    try {
        const raw    = localStorage.getItem("reservasGuardadas");
        const parsed = raw ? JSON.parse(raw) : [];
        return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
        console.warn("Error al leer historial:", e);
        return [];
    }
}
 
/** Guarda el historial actualizado en localStorage. */
function guardarHistorial(historial) {
    localStorage.setItem("reservasGuardadas", JSON.stringify(historial));
}
 
/**
 * Si hay una reserva nueva confirmada en sessionStorage, la agrega al historial
 * de localStorage evitando duplicados. Devuelve el historial completo.
 */
function obtenerReservas() {
    const historial     = leerHistorial();
    const nuevaReserva  = construirReservaDesdeSesion();
 
    if (nuevaReserva) {
        const yaExiste = historial.some(r => r.id === nuevaReserva.id);
        if (!yaExiste) {
            historial.unshift(nuevaReserva);
            guardarHistorial(historial);
        }
        // Limpia la bandera para evitar guardados duplicados futuros
        sessionStorage.removeItem("reservaConfirmada");
    }
 
    return historial;
}
/* #endregion */
 
 
/* #region Generación de HTML */
 
/** Genera el bloque HTML de un vuelo (ida o vuelta). */
function htmlVuelo({ etiqueta, origen, destino, codigoOrigen, codigoDestino, salida, llegada, duracion, fecha, icono }) {
    return `
        <div class="vuelo">
            <h3>${etiqueta}</h3>
            <h4>${origen} (${codigoOrigen}) <i class="fa-solid ${icono}"></i> ${destino} (${codigoDestino})</h4>
            <div class="tiempo-vuelo">${salida} <span class="time-separator">—</span> ${llegada}</div>
            <div class="duracion-vuelo">${duracion}</div>
            <div class="info-vuelo">${fecha}</div>
        </div>
    `;
}
 
/** Construye el HTML completo de un acordeón para una reserva. */
function htmlAcordeon(reserva, index) {
    const tituloRuta  = `${reserva.origen} → ${reserva.destino}`;
    const precioTexto = reserva.precio ? `USD ${reserva.precio}` : "Precio no disponible";
 
    const vueloIda = htmlVuelo({
        etiqueta:      "Ida:",
        origen:        reserva.origen,
        destino:       reserva.destino,
        codigoOrigen:  reserva.codigoOrigen,
        codigoDestino: reserva.codigoDestino,
        salida:        reserva.salidaIda,
        llegada:       reserva.llegadaIda,
        duracion:      reserva.duracionIda,
        fecha:         reserva.fechaIda,
        icono:         "fa-arrow-right-long",
    });
 
    const vueloVuelta = (reserva.tipoVuelo !== "solo-ida" && reserva.fechaVuelta)
        ? htmlVuelo({
            etiqueta:      "Vuelta:",
            origen:        reserva.destino,
            destino:       reserva.origen,
            codigoOrigen:  reserva.codigoDestino,
            codigoDestino: reserva.codigoOrigen,
            salida:        reserva.llegadaIda,
            llegada:       reserva.salidaIda,
            duracion:      reserva.duracionIda,
            fecha:         reserva.fechaVuelta,
            icono:         "fa-arrow-left-long",
        })
        : "";
 
    const infoBadge = `
        <div class="info-badge">
            <span>${reserva.aerolinea}</span>
            <span>${reserva.clase}</span>
            <span>${reserva.pasajeros} pasajero(s)</span>
        </div>
    `;
 
    return `
        <div class="acordion">
            <div class="acordion-header" data-acordion="${index}">
                <span class="nombre-ruta">${tituloRuta}</span>
                <div class="precio-y-flecha">
                    <span class="precio-ruta">${precioTexto}</span>
                    <span class="flecha-acordion">▼</span>
                </div>
            </div>
            <div class="acordion-content" id="acordion-${index}">
                <div class="detalle-vuelo">
                    <div class="ruta-vuelo">
                        ${vueloIda}
                        ${vueloVuelta}
                    </div>
                    ${infoBadge}
                </div>
            </div>
        </div>
    `;
}
/* #endregion */
 
 
/* #region Render y control de acordeones */
 
/** Renderiza todos los acordeones en el contenedor principal. */
function renderizarReservas() {
    const contenedor = document.querySelector(".container");
 
    // Eliminar acordeones previos conservando el <h2>
    contenedor.querySelectorAll(".acordion").forEach(el => el.remove());
 
    // Limpiar también el mensaje de "sin reservas" si existía
    const sinReservasPrevio = contenedor.querySelector(".sin-reservas");
    if (sinReservasPrevio) sinReservasPrevio.remove();
 
    const reservas = obtenerReservas();
 
    if (reservas.length === 0) {
        const p = document.createElement("p");
        p.className     = "sin-reservas";
        p.textContent   = "No tenés vuelos reservados aún.";
        contenedor.appendChild(p);
        return;
    }
 
    reservas.forEach((reserva, index) => {
        const wrapper = document.createElement("div");
        wrapper.innerHTML = htmlAcordeon(reserva, index);
        contenedor.appendChild(wrapper.firstElementChild);
    });
 
    // Se inicializan los acordeones DESPUÉS de inyectar el HTML en el DOM
    inicializarAcordeones();
 
    // Primer acordeón abierto por defecto
    abrirAcordeon(0);
}
 
function inicializarAcordeones() {
    document.querySelectorAll(".acordion-header").forEach(header => {
        header.addEventListener("click", function () {
            toggleAcordeon(this.getAttribute("data-acordion"));
        });
    });
}
 
function toggleAcordeon(numero) {
    const header = document.querySelector(`[data-acordion="${numero}"]`);
    if (header.classList.contains("active")) {
        cerrarAcordeon(numero);
    } else {
        cerrarTodosLosAcordeones();
        abrirAcordeon(numero);
    }
}
 
function abrirAcordeon(numero) {
    const header    = document.querySelector(`[data-acordion="${numero}"]`);
    const contenido = document.getElementById(`acordion-${numero}`);
    header?.classList.add("active");
    contenido?.classList.add("active");
}
 
function cerrarAcordeon(numero) {
    const header    = document.querySelector(`[data-acordion="${numero}"]`);
    const contenido = document.getElementById(`acordion-${numero}`);
    header?.classList.remove("active");
    contenido?.classList.remove("active");
}
 
function cerrarTodosLosAcordeones() {
    document.querySelectorAll(".acordion-header").forEach(h => h.classList.remove("active"));
    document.querySelectorAll(".acordion-content").forEach(c => c.classList.remove("active"));
}
/* #endregion */
 
 
/* #region Init */
document.addEventListener("DOMContentLoaded", renderizarReservas);
/* #endregion */