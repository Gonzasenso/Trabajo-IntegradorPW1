const datosBusqueda =
    JSON.parse(
        sessionStorage.getItem(
            "ultimaBusqueda"
        )
    );

// Mostrar Origen y Destino
document.querySelector("#origenBusqueda")
    .textContent =
    datosBusqueda.origen.charAt(0).toUpperCase() +
    datosBusqueda.origen.slice(1);

document.querySelector("#destinoBusqueda")
    .textContent =
    datosBusqueda.destino.charAt(0).toUpperCase() +
    datosBusqueda.destino.slice(1);

// Mostrar fechas
document.querySelector(
    "#fechaIdaBusqueda"
).textContent =
    datosBusqueda.fechaIda;

document.querySelector(
    "#fechaVueltaBusqueda"
).textContent =
    datosBusqueda.fechaVuelta;

// Mostrar Pasajeros
document.querySelector(
    "#pasajerosBusqueda"
).textContent =
    `${datosBusqueda.pasajeros} pasajero(s)`;

// Mostrar Clase
document.querySelector("#claseBusqueda")
    .textContent =
    datosBusqueda.clase.charAt(0).toUpperCase() +
    datosBusqueda.clase.slice(1);

// Datos
const vuelos = [
    {
        id: 1,
        origen: "Buenos Aires",
        destino: "Madrid",
        codigoOrigen: "BUE",
        codigoDestino: "MAD",
        aerolinea: "Air Europa",
        tipo: "2 o mas escalas",
        salida: "08:30",
        llegada: "19:45",
        duracion: "11h 15m",
        precio: 900,
        detalle: "../detalle-de-vuelo/detalle-de-vuelo-madrid1.html",
        logo: "../../img/Logos Aerolineas/air-europa-logo.png"
    },
    {
        id: 2,
        origen: "Buenos Aires",
        destino: "Madrid",
        codigoOrigen: "BUE",
        codigoDestino: "MAD",
        aerolinea: "Iberia",
        tipo: "Directo",
        salida: "12:30",
        llegada: "23:45",
        duracion: "13h 15m",
        precio: 1000,
        detalle: "../detalle-de-vuelo/detalle-de-vuelo-madrid3.html",
        logo: "../../img/Logos Aerolineas/iberia-logo.png"
    },
    {
        id: 3,
        origen: "Buenos Aires",
        destino: "Cancun",
        codigoOrigen: "BUE",
        codigoDestino: "CUN",
        aerolinea: "LATAM",
        tipo: "2 o mas escalas",
        salida: "17:00",
        llegada: "04:15",
        duracion: "11h 15m",
        precio: 700,
        detalle: "../detalle-de-vuelo/detalle-de-vuelo-madrid2.html",
        logo: "../../img/Logos Aerolineas/Latam-logo.png"
    },
    {
        id: 4,
        origen: "Buenos Aires",
        destino: "Rio de Janeiro",
        codigoOrigen: "BUE",
        codigoDestino: "GIG",
        aerolinea: "LATAM",
        tipo: "1 escala",
        salida: "09:30",
        llegada: "12:10",
        duracion: "2h 40m",
        precio: 280,
        detalle: "#",
        logo: "../../img/Logos Aerolineas/Latam-logo.png"
    },
    {
        id: 5,
        origen: "Buenos Aires",
        destino: "Roma",
        codigoOrigen: "BUE",
        codigoDestino: "FCO",
        aerolinea: "Iberia",
        tipo: "1 escala",
        salida: "11:20",
        llegada: "05:50",
        duracion: "14h 30m",
        precio: 740,
        detalle: "#",
        logo: "../../img/Logos Aerolineas/iberia-logo.png"
    },
    {
        id: 6,
        origen: "Buenos Aires",
        destino: "Tokio",
        codigoOrigen: "BUE",
        codigoDestino: "HND",
        aerolinea: "LATAM",
        tipo: "2 o mas escalas",
        salida: "08:00",
        llegada: "14:30",
        duracion: "28h 30m",
        precio: 1200,
        detalle: "#",
        logo: "../../img/Logos Aerolineas/Latam-logo.png"
    },
    {
        id: 7,
        origen: "Buenos Aires",
        destino: "Maldivias",
        codigoOrigen: "BUE",
        codigoDestino: "MLE",
        aerolinea: "Iberia",
        tipo: "1 escala",
        salida: "22:15",
        llegada: "23:50",
        duracion: "22h 35m",
        precio: 1890,
        detalle: "#",
        logo: "../../img/Logos Aerolineas/iberia-logo.png"
    }
];

// Selectores
const contenedor = document.querySelector("#contenedorVuelos");

const filtroPrecio = document.querySelector("#filtroPrecio");

const precioActual = document.querySelector("#precioActual");

const filtrosAerolinea = document.querySelectorAll(".filtroAerolinea");

const filtrosTipo = document.querySelectorAll(".filtroTipo");

const contador = document.querySelector("#cantidadVuelos");

const equipajeExtra = document.querySelector("#equipajeExtra");

const labelEquipaje = equipajeExtra.parentElement;

if (datosBusqueda.equipajeIncluido) {

    equipajeExtra.checked = true;

    equipajeExtra.disabled = true;

    labelEquipaje.innerHTML = `
        <input
            type="checkbox"
            id="equipajeExtra"
            checked
            disabled
        >
        Valija 23kg incluida
    `;

}


function calcularPrecio(vuelo) {

    let precioFinal = vuelo.precio;

    // Clase
    if (datosBusqueda.clase === "business") {
        precioFinal *= 1.5;
    }

    if (datosBusqueda.clase === "first") {
        precioFinal *= 2;
    }

    // Pasajeros
    precioFinal *= Number(
        datosBusqueda.pasajeros
    );

    // Equipaje
    if (equipajeExtra.checked && !datosBusqueda.equipajeIncluido) {

        precioFinal += 100 * Number(datosBusqueda.pasajeros);

    }

    return Math.round(precioFinal);

}

// Renderizado
function renderizarVuelos(lista) {

    contenedor.innerHTML = "";

    contador.textContent =
        `${lista.length} vuelos encontrados`;

    lista.forEach(vuelo => {

        const precioFinal = calcularPrecio(vuelo);

        contenedor.innerHTML += `

        <article class="cardVuelo">

            <div class="aerolinea">
                <img src="${vuelo.logo}">
            </div>

            <div class="horario">
                <strong>${vuelo.salida}</strong>
                <span>${vuelo.codigoOrigen}</span>
            </div>

            <div class="trayecto">
                <span>${vuelo.tipo}</span>
                <div class="lineaTrayecto">
                    <i class="fa-solid fa-plane"></i>
                </div>
                <small>${vuelo.duracion}</small>
            </div>

            <div class="horario">
                <strong>${vuelo.llegada}</strong>
                <span>${vuelo.codigoDestino}</span>
            </div>

            <div class="duracion">
                ${vuelo.duracion}
            </div>

            <div class="precio">
                <strong>USD ${precioFinal}</strong>
                <span>${datosBusqueda.pasajeros} pasajero(s)</span>

                <a href="${vuelo.detalle}">
                    Ver detalles
                </a>
            </div>

        </article>

        `;
    });

}

// Filtrado
function filtrarVuelos() {

    const precioMax =
        Number(filtroPrecio.value);

    const aerolineas =
        [...filtrosAerolinea]
            .filter(c => c.checked)
            .map(c => c.value);

    const tipos =
        [...filtrosTipo]
            .filter(c => c.checked)
            .map(c => c.value);

    const resultado =
        vuelosFiltrados.filter(vuelo => {

            const cumplePrecio = calcularPrecio(vuelo) <= precioMax;

            const cumpleAerolinea =
                aerolineas.length === 0 ||
                aerolineas.includes(
                    vuelo.aerolinea
                );

            const cumpleTipo =
                tipos.length === 0 ||
                tipos.includes(
                    vuelo.tipo
                );

            return (
                cumplePrecio &&
                cumpleAerolinea &&
                cumpleTipo
            );

        });

    if (resultado.length === 0) {

        contenedor.innerHTML = `
            <div class="sinResultados">
                <h3>No se encontraron vuelos</h3>
                <p>Probá modificando los filtros.</p>
            </div>
        `;

        contador.textContent = "0 vuelos encontrados";

        return;
    }


    renderizarVuelos(resultado);

}

// Range
filtroPrecio.addEventListener(
    "input",
    () => {

        precioActual.textContent =
            `USD ${filtroPrecio.value}`;

        filtrarVuelos();

    });

// Aerolineas
filtrosAerolinea.forEach(check => {

    check.addEventListener(
        "change",
        filtrarVuelos
    );

});

// Tipo de Vuelo
filtrosTipo.forEach(check => {

    check.addEventListener(
        "change",
        filtrarVuelos
    );

});

const vuelosFiltrados =
    vuelos.filter(vuelo => {

        return (

            vuelo.origen.toLowerCase() ===
            datosBusqueda.origen.toLowerCase()

            &&

            vuelo.destino.toLowerCase() ===
            datosBusqueda.destino.toLowerCase()

        );

    });

const precioMasAlto =
    Math.max(
        ...vuelosFiltrados.map(
            vuelo => calcularPrecio(vuelo)
        )
    );

filtroPrecio.max = precioMasAlto;
filtroPrecio.value = precioMasAlto;

precioActual.textContent =
    `USD ${precioMasAlto}`;

if (vuelosFiltrados.length > 0) {

    const tipoVuelo =
        vuelosFiltrados[0].tipo;

    document
        .querySelectorAll(".filtroTipo")
        .forEach(radio => {

            radio.checked =
                radio.value === tipoVuelo;

        });

}

if (vuelosFiltrados.length === 0) {

    contenedor.innerHTML = `
        <h2>
            No se encontraron vuelos
        </h2>
    `;

} else {

    renderizarVuelos(vuelosFiltrados);

}

// Aplicar filtros iniciales
filtrarVuelos();


// Ordenar por precio

// Mejor Opcion
document
    .querySelector("#mejorOpcion")
    .addEventListener("click", () => {

        renderizarVuelos(vuelosFiltrados);

        document.querySelector("#toggleDropdown").checked = false;

    });

// Menor Precio
document
    .querySelector("#menorPrecio")
    .addEventListener("click", () => {

        const ordenados =
            [...vuelosFiltrados].sort(
                (a, b) => a.precio - b.precio
            );

        renderizarVuelos(ordenados);

        document.querySelector("#toggleDropdown").checked = false;

    });

// Menor Duracion
document
    .querySelector("#menorDuracion")
    .addEventListener("click", () => {

        const ordenados =
            [...vuelosFiltrados].sort(
                (a, b) => {

                    const duracionA =
                        parseInt(a.duracion);

                    const duracionB =
                        parseInt(b.duracion);

                    return duracionA - duracionB;

                });

        renderizarVuelos(ordenados);

        document.querySelector(
            "#toggleDropdown"
        ).checked = false;

    });

// Salida mas temprana
document
    .querySelector("#salidaTemprana")
    .addEventListener("click", () => {

        const ordenados =
            [...vuelosFiltrados].sort(
                (a, b) => {

                    return a.salida.localeCompare(
                        b.salida
                    );

                });

        renderizarVuelos(ordenados);

        document.querySelector("#toggleDropdown").checked = false;

    });

// Equipaje
equipajeExtra.addEventListener(
    "change",
    () => {

        if (datosBusqueda.equipajeIncluido) {
            return;
        }

        if (equipajeExtra.checked) {

            alert(
                "Se agregará equipaje extra por USD 100"
            );

        }

        filtrarVuelos();

    });

