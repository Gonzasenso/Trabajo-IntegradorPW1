//  Detalles del vuelo elegido.
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
/**
 * Pone la primera letra en mayúscula */
function capitalizar(str = "") {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Calcula el precio final según clase, pasajeros y equipaje.*/
function calcularPrecioFinal(precioBase, busqueda) {
    let precio = precioBase;
    if (busqueda.clase === "business") precio *= 1.5;
    if (busqueda.clase === "first")    precio *= 2;
    precio *= Number(busqueda.pasajeros);
    if (busqueda.equipajeIncluido)     precio += 100 * Number(busqueda.pasajeros);
    return Math.round(precio);
}

/**
 * Busca en el catálogo el vuelo que mejor coincide con el origen y destino de una reserva. */
function buscarVueloCatalogo(origen, destino) {
    return catalogoVuelos.find(
        v =>
            v.origen.toLowerCase()  === origen.toLowerCase() &&
            v.destino.toLowerCase() === destino.toLowerCase()
    ) || null;
}
/**
 * Construye un objeto reserva  a partir de los datos de sessionStorage ("ultimaBusqueda") y el catálogo de vuelos.
 * Devuelve null si no hay datos en sesión.
 */
function construirReservaDesdeSesion() {
    // Si el usuario no llegó a confirmar, no se guarda nada
    const confirmada = sessionStorage.getItem("reservaConfirmada");
    if (confirmada !== "true") return null;

    const raw = sessionStorage.getItem("ultimaBusqueda");
    if (!raw) return null;

    try {
        const datos = JSON.parse(raw);
        const vuelo = buscarVueloCatalogo(datos.origen, datos.destino);

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
            precio:        vuelo ? calcularPrecioFinal(vuelo.precio, datos) : null,
        };
    } catch (e) {
        console.warn("Error al parsear ultimaBusqueda:", e);
        return null;
    }
}

/**
 * Lee el historial acumulado de reservas desde localStorage.
 * Devuelve siempre un array (vacío si no hay nada). */
function leerHistorial() {
    try {
        const raw = localStorage.getItem("reservasGuardadas");
        const parsed = raw ? JSON.parse(raw) : [];
        return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
        console.warn("Error al leer historial:", e);
        return [];
    }
}

/**
 * Guarda el historial actualizado en localStorage. */
function guardarHistorial(historial) {
    localStorage.setItem("reservasGuardadas", JSON.stringify(historial));
}

/**
 * Si hay una reserva nueva en sessionStorage, la agrega al historial de localStorage (evitando duplicados por ID). Luego devuelve el historial completo para renderizar. */
function obtenerReservas() {
    const historial = leerHistorial();
    const nuevaReserva = construirReservaDesdeSesion();

    if (nuevaReserva) {
        const yaExiste = historial.some(r => r.id === nuevaReserva.id);
        if (!yaExiste) {
            historial.unshift(nuevaReserva);
            guardarHistorial(historial);
        }
        // Ya se usó la confirmación, se limpia para evitar guardados accidentales futuros
        sessionStorage.removeItem("reservaConfirmada");
    }

    return historial;
}
/**
 * Genera el HTML del bloque de un vuelo de ida o vuelta. */
function htmlVuelo({ etiqueta, origen, destino, codigoOrigen, codigoDestino, salida, llegada, duracion, fecha, icono }) {
    return `
        <div class="vuelo">
            <h3>${etiqueta}</h3>
            <h4>${origen}(${codigoOrigen}) <i class="fa-solid ${icono}"></i> ${destino}(${codigoDestino})</h4>
            <div class="tiempo-vuelo">${salida} <span class="time-separator">—</span> ${llegada}</div>
            <div class="duracion-vuelo">${duracion}</div>
            <div class="info-vuelo">${fecha}</div>
        </div>
    `;
}

/**
 * Construye el HTML completo de un acordeón para una reserva. */
function htmlAcordeon(reserva, index) {
    const tituloRuta  = `${reserva.origen} → ${reserva.destino}`;
    const precioTexto = reserva.precio ? `USD ${reserva.precio}` : "Precio no disponible";

    const vueloIda = htmlVuelo({
        etiqueta:     "Ida:",
        origen:       reserva.origen,
        destino:      reserva.destino,
        codigoOrigen: reserva.codigoOrigen,
        codigoDestino:reserva.codigoDestino,
        salida:       reserva.salidaIda,
        llegada:      reserva.llegadaIda,
        duracion:     reserva.duracionIda,
        fecha:        reserva.fechaIda,
        icono:        "fa-arrow-right-long",
    });

    // Vuelta: solo se muestra si no es "Solo Ida"
    const vueloVuelta = (reserva.tipoVuelo !== "solo-ida" && reserva.fechaVuelta)
        ? htmlVuelo({
            etiqueta:     "Vuelta:",
            origen:       reserva.destino,
            destino:      reserva.origen,
            codigoOrigen: reserva.codigoDestino,
            codigoDestino:reserva.codigoOrigen,
            salida:       reserva.llegadaIda,   
            llegada:      reserva.salidaIda,    
            duracion:     reserva.duracionIda,
            fecha:        reserva.fechaVuelta,
            icono:        "fa-arrow-left-long",
        })
        : "";

    // Badge de clase y aerolinea debajo del precio
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

/**
 * Renderiza todos los acordeones en el contenedor principal. */
function renderizarReservas() {
    const contenedor = document.querySelector(".container");
    const titulo     = contenedor.querySelector("h2"); // conserva el <h2>

    const reservas = obtenerReservas();

    // Limpiar acordeones previos (si los hubiera)
    contenedor.querySelectorAll(".acordion").forEach(el => el.remove());

    if (reservas.length === 0) {
        const sinResultados = document.createElement("p");
        sinResultados.className = "sin-reservas";
        sinResultados.textContent = "No tenés vuelos reservados aún.";
        contenedor.appendChild(sinResultados);
        return;
    }

    reservas.forEach((reserva, index) => {
        const wrapper = document.createElement("div");
        wrapper.innerHTML = htmlAcordeon(reserva, index);
        contenedor.appendChild(wrapper.firstElementChild);
    });
}

function inicializarAcordeones() {
    const headers = document.querySelectorAll(".acordion-header");
    headers.forEach(header => {
        header.addEventListener("click", function () {
            const numero = this.getAttribute("data-acordion");
            toggleAcordeon(numero);
        });
    });
}

function toggleAcordeon(numero) {
    const header    = document.querySelector(`[data-acordion="${numero}"]`);
    const estaAbierto = header.classList.contains("active");
    if (estaAbierto) {
        cerrarAcordeon(numero);
    } else {
        cerrarTodosLosAcordeones();
        abrirAcordeon(numero);
    }
}

function abrirAcordeon(numero) {
    const header   = document.querySelector(`[data-acordion="${numero}"]`);
    const contenido = document.getElementById(`acordion-${numero}`);
    header?.classList.add("active");
    contenido?.classList.add("active");
}

function cerrarAcordeon(numero) {
    const header   = document.querySelector(`[data-acordion="${numero}"]`);
    const contenido = document.getElementById(`acordion-${numero}`);
    header?.classList.remove("active");
    contenido?.classList.remove("active");
}

function cerrarTodosLosAcordeones() {
    document.querySelectorAll(".acordion-header").forEach(h  => h.classList.remove("active"));
    document.querySelectorAll(".acordion-content").forEach(c => c.classList.remove("active"));
}

document.addEventListener("DOMContentLoaded", function () {
    renderizarReservas();
    inicializarAcordeones();
    abrirAcordeon(0); // primer acordeón abierto por defecto
});