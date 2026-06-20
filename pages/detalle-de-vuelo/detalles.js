document.addEventListener('DOMContentLoaded', () => {
    // 1. Obtención segura del estado desde sessionStorage
    const datosBusqueda = JSON.parse(sessionStorage.getItem('ultimaBusqueda'));
    const vuelo = JSON.parse(sessionStorage.getItem('vueloSeleccionado'));

    // Redirección de seguridad si perdemos el contexto del vuelo seleccionado
    if (!vuelo || !datosBusqueda) {
        window.location.href = "../resultados-de-busqueda/filtro-1.html";
        return;
    }

    const esIdaVuelta = datosBusqueda.tipoVuelo === 'ida-vuelta';
    const cantidadPasajeros = parseInt(datosBusqueda.pasajeros, 10) || 1;

    // Estructuras de control para el mapa de asientos
    const totalFilas = 8;
    const letrasColumnas = ["A", "B", "C", "D", "E", "F"];
    
    // Simulación de asientos ocupados persistentes por tramo
    const asientosOcupadosIda = ["1B", "1C", "2E", "5B", "5E", "7B", "7C"];
    const asientosOcupadosVuelta = ["3A", "4C", "4D", "6B", "8E", "8F"];

    // 2. Renderizado de la información del vuelo (Panel Izquierdo)
    renderizarInformacionVuelos(vuelo, datosBusqueda, esIdaVuelta);

    // 3. Renderizado de los mapas de asientos (Panel Derecho)
    const contenedorMapas = document.getElementById('contenedor-mapas-asientos');
    contenedorMapas.innerHTML = ""; // Limpieza inicial

    // Inyectamos mapa de ida
    contenedorMapas.appendChild(crearEstructuraMapa('ida', 'Ida', asientosOcupadosIda));
    
    // Si aplica, inyectamos mapa de vuelta
    if (esIdaVuelta) {
        contenedorMapas.appendChild(crearEstructuraMapa('vuelta', 'Vuelta', asientosOcupadosVuelta));
    }

    // 4. Cálculos Financieros Dinámicos
    calcularYMostrarPrecios(vuelo, datosBusqueda, esIdaVuelta, cantidadPasajeros);

    // 5. Gestión del Evento de Persistencia al Continuar
    configurarBotonContinuar(cantidadPasajeros, esIdaVuelta);
});

/**
 * Genera de forma semántica las cards informativas de los tramos de vuelo
 */
function renderizarInformacionVuelos(vuelo, datosBusqueda, esIdaVuelta) {
    const contenedorInfo = document.getElementById('panel-vuelos-info');
    
    // Formatear cadenas para capitalización correcta
    const origenCapitalizado = datosBusqueda.origen.charAt(0).toUpperCase() + datosBusqueda.origen.slice(1);
    const destinoCapitalizado = datosBusqueda.destino.charAt(0).toUpperCase() + datosBusqueda.destino.slice(1);

    let htmlContenido = `
        <section class="ida-card">
            <p><strong>Ida</strong> - ${datosBusqueda.fechaIda}</p>
            <div class="aerolinea">
                <img src="${vuelo.logo}" alt="Logo de ${vuelo.aerolinea}">
                <span>${vuelo.aerolinea}</span>
            </div>
            <div class="linea-tiempo">
                <div class="origen">
                    <span class="hora">${vuelo.salida}</span>
                    <span class="codigo">${vuelo.codigoOrigen}</span>
                    <span class="ciudad">${origenCapitalizado}</span>
                </div>
                <div class="conexion">
                    <span>${vuelo.tipo}</span>
                    <div class="linea"></div>
                    <span>${vuelo.duracion}</span>
                </div>
                <div class="destino">
                    <span class="hora">${vuelo.llegada}</span>
                    <span class="codigo">${vuelo.codigoDestino}</span>
                    <span class="ciudad">${destinoCapitalizado}</span>
                </div>
            </div>
        </section>
    `;

    if (esIdaVuelta) {
        htmlContenido += `
            <section class="vuelta-card">
                <p><strong>Vuelta</strong> - ${datosBusqueda.fechaVuelta}</p>
                <div class="aerolinea">
                    <img src="${vuelo.logo}" alt="Logo de ${vuelo.aerolinea}">
                    <span>${vuelo.aerolinea}</span>
                </div>
                <div class="linea-tiempo">
                    <!-- Invertimos los puntos de origen y destino para el tramo de regreso -->
                    <div class="origen">
                        <span class="hora">${vuelo.salida}</span>
                        <span class="codigo">${vuelo.codigoDestino}</span>
                        <span class="ciudad">${destinoCapitalizado}</span>
                    </div>
                    <div class="conexion">
                        <span>${vuelo.tipo}</span>
                        <div class="linea"></div>
                        <span>${vuelo.duracion}</span>
                    </div>
                    <div class="destino">
                        <span class="hora">${vuelo.llegada}</span>
                        <span class="codigo">${vuelo.codigoOrigen}</span>
                        <span class="ciudad">${origenCapitalizado}</span>
                    </div>
                </div>
            </section>
        `;
    }

    // Contenedor base del desglose de precios que será llenado dinámicamente
    htmlContenido += `
        <section class="precio-card" id="desglose-precios-card">
            <h3>Resumen de Precio</h3><br>
            <div class="fila-precio"><span>Pasajeros</span><span id="txt-calc-pasajeros">-</span></div>
            <div class="fila-precio"><span>Tarifa base</span><span id="txt-calc-tarifa">-</span></div>
            <div class="fila-precio"><span>Impuestos</span><span id="txt-calc-impuestos">-</span></div>
            <div class="total"><span>TOTAL</span><span id="txt-calc-total">-</span></div>
        </section>
        <aside class="informacion-card">
            <div class="info-titulo"><i class="fa-solid fa-circle-info"></i><h3>Información</h3></div>
            <p>Por favor seleccione los asientos correspondientes para cada tramo del viaje antes de proceder.</p>
        </aside>
    `;

    contenedorInfo.innerHTML = htmlContenido;
}

/**
 * Fábrica de componentes que construye un mapa de asientos accesible (WCAG Compliant)
 */
function crearEstructuraMapa(tipoTramo, tituloLabel, asientosOcupados) {
    const divMapa = document.createElement('div');
    divMapa.className = "mapa-asientos";
    divMapa.style.marginBottom = "2.5rem";

    const titulo = document.createElement('h3');
    titulo.textContent = `Tramo de ${tituloLabel}`;
    titulo.style.textAlign = "center";
    titulo.style.color = "#0F172A";

    const frente = document.createElement('div');
    frente.className = "frente-avion";
    frente.innerHTML = "<span>Frente del avión</span>";

    const cabecera = document.createElement('div');
    cabecera.className = "cabecera-columnas";
    cabecera.innerHTML = "<span></span><span>A</span><span>B</span><span>C</span><div class='pasillo'></div><span>D</span><span>E</span><span>F</span><span></span>";

    divMapa.appendChild(titulo);
    divMapa.appendChild(frente);
    divMapa.appendChild(cabecera);

    // Generamos las filas dinámicamente aplicando DRY
    for (let f = 1; f <= 8; f++) {
        const filaElement = document.createElement('div');
        filaElement.className = "fila";

        const numFilaIzq = document.createElement('span');
        numFilaIzq.className = "numero-fila";
        numFilaIzq.textContent = f;
        filaElement.appendChild(numFilaIzq);

        // Renderizado de las columnas A-F
        ["A", "B", "C", "D", "E", "F"].forEach((letra, index) => {
            if (index === 3) {
                const pasillo = document.createElement('div');
                pasillo.className = "pasillo";
                filaElement.appendChild(pasillo);
            }

            const codigoAsiento = `${f}${letra}`;
            
            // Reemplazo semántico y accesible: Usamos un button nativo en lugar de div
            const botonAsiento = document.createElement('button');
            botonAsiento.type = "button";
            botonAsiento.className = "asiento";
            botonAsiento.dataset.codigo = codigoAsiento;
            botonAsiento.dataset.tramo = tipoTramo;

            if (asientosOcupados.includes(codigoAsiento)) {
                botonAsiento.classList.add('ocupado');
                botonAsiento.setAttribute('aria-label', `Asiento ${codigoAsiento} de ${tituloLabel}, Ocupado`);
            } else {
                botonAsiento.setAttribute('aria-label', `Asiento ${codigoAsiento} de ${tituloLabel}, Disponible`);
                
                // Event listener individual para encapsular el comportamiento del tramo
                botonAsiento.addEventListener('click', () => gestionarSeleccionAsiento(botonAsiento, tipoTramo));
            }

            filaElement.appendChild(botonAsiento);
        });

        const numFilaDer = document.createElement('span');
        numFilaDer.className = "numero-fila";
        numFilaDer.textContent = f;
        filaElement.appendChild(numFilaDer);

        divMapa.appendChild(filaElement);
    }

    const trasera = document.createElement('div');
    trasera.className = "trasera-avion";
    trasera.innerHTML = "<span>Parte trasera del avión</span>";
    divMapa.appendChild(trasera);

    return divMapa;
}

/**
 * Controla la máquina de estados de selección de asientos por tramo
 */
function gestionarSeleccionAsiento(boton, tipoTramo) {
    const datosBusqueda = JSON.parse(sessionStorage.getItem('ultimaBusqueda'));
    const cupoMaximo = parseInt(datosBusqueda.pasajeros, 10) || 1;

    if (boton.classList.contains('seleccionado')) {
        boton.classList.remove('seleccionado');
        // Actualizamos el estado del botón cada vez que se deselecciona un asiento
        actualizarEstadoBoton();
        return;
    }

    // Buscamos cuántos asientos han sido seleccionados exclusivamente en ESTE tramo
    const seleccionadosEnTramo = document.querySelectorAll(`.asiento.seleccionado[data-tramo="${tipoTramo}"]`).length;

    if (seleccionadosEnTramo < cupoMaximo) {
        boton.classList.add('seleccionado');
    } else {
        alert(`Has alcanzado el límite. Tu reserva es para ${cupoMaximo} passenger(s) en el tramo de ${tipoTramo}.`);
    }

    // Actualizamos el estado del botón tras cada intento de selección exitoso
    actualizarEstadoBoton();
}

/**
 * Evalúa las condiciones en tiempo real y habilita/deshabilita el botón de continuar
 */
function actualizarEstadoBoton() {
    const btn = document.getElementById('btn-continuar');
    if (!btn) return;

    const datosBusqueda = JSON.parse(sessionStorage.getItem('ultimaBusqueda'));
    const cantidadPasajeros = parseInt(datosBusqueda.pasajeros, 10) || 1;
    const esIdaVuelta = datosBusqueda.tipoVuelo === 'ida-vuelta';

    // Contamos los asientos seleccionados por tramo en el DOM actual
    const seleccionadosIda = document.querySelectorAll('.asiento.seleccionado[data-tramo="ida"]').length;
    const seleccionadosVuelta = document.querySelectorAll('.asiento.seleccionado[data-tramo="vuelta"]').length;

    // Condición estricta: Ida completa
    const idaCompleta = (seleccionadosIda === cantidadPasajeros);
    
    // Condición estricta: Vuelta completa (si corresponde)
    const vueltaCompleta = !esIdaVuelta || (seleccionadosVuelta === cantidadPasajeros);

    // Si ambas condiciones se cumplen, removemos el atributo 'disabled'
    if (idaCompleta && vueltaCompleta) {
        btn.disabled = false;
    } else {
        btn.disabled = true;
    }
}


function calcularYMostrarPrecios(vuelo, datosBusqueda, esIdaVuelta, cantidadPasajeros) {
    let precioBaseIndividual = vuelo.precio;

    // Multiplicador estricto por segmentación de clase
    if (datosBusqueda.clase === "business") {
        precioBaseIndividual *= 1.5;
    } else if (datosBusqueda.clase === "first") {
        precioBaseIndividual *= 2;
    }

    // REGLA: Si es viaje redondo (Ida y Vuelta), el costo del tramo base se duplica
    if (esIdaVuelta) {
        precioBaseIndividual *= 2;
    }

    const subtotalTarifa = Math.round(precioBaseIndividual * cantidadPasajeros);
    
    // Impuestos proporcionales calculados por volumen de pasajeros y tramos (90 USD base por tramo por persona)
    const impuestosBasePorPersona = esIdaVuelta ? 180 : 90;
    const totalImpuestos = impuestosBasePorPersona * cantidadPasajeros;
    const granTotal = subtotalTarifa + totalImpuestos;

    // Modificación explícita de nodos DOM
    document.getElementById('txt-calc-pasajeros').textContent = `${cantidadPasajeros} x ${datosBusqueda.clase.toUpperCase()}`;
    document.getElementById('txt-calc-tarifa').textContent = `USD ${subtotalTarifa}`;
    document.getElementById('txt-calc-impuestos').textContent = `USD ${totalImpuestos}`;
    document.getElementById('txt-calc-total').textContent = `USD ${granTotal}`;

    // Preservar en localStorage para pasos posteriores de la checkout
    localStorage.setItem("resumenVuelo", JSON.stringify({
        tarifa: subtotalTarifa,
        impuestos: totalImpuestos,
        total: granTotal,
        pasajeros: cantidadPasajeros
    }));
}

/**
 * Asegura la integridad de la selección y maneja la navegación del botón nativo
 */
function configurarBotonContinuar(cantidadPasajeros, esIdaVuelta) {
    const btn = document.getElementById('btn-continuar');
    if (!btn) return;

    btn.addEventListener('click', () => {
        // Obtenemos los códigos finales elegidos por el usuario
        const seleccionadosIda = [...document.querySelectorAll('.asiento.seleccionado[data-tramo="ida"]')].map(a => a.dataset.codigo);
        const seleccionadosVuelta = [...document.querySelectorAll('.asiento.seleccionado[data-tramo="vuelta"]')].map(a => a.dataset.codigo);

        // Estructuración del objeto final de persistencia
        const mapaAsientosReserva = {
            ida: seleccionadosIda,
            vuelta: esIdaVuelta ? seleccionadosVuelta : []
        };

        sessionStorage.setItem("asientosSeleccionados", JSON.stringify(mapaAsientosReserva));

        // Como ahora es un <button> y no un <a>, redirigimos manualmente por código de manera limpia
        window.location.href = "../checkout/pasajeros.html";
    });
}