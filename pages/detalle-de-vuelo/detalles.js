document.addEventListener('DOMContentLoaded', () => {

    const datosBusqueda = JSON.parse(sessionStorage.getItem('ultimaBusqueda'));
    const vuelo = JSON.parse(sessionStorage.getItem('vueloSeleccionado'));

    if (!vuelo || !datosBusqueda) {
        window.location.href = '../resultados-de-busqueda/filtro-1.html';
        return;
    }

    const esIdaVuelta = datosBusqueda.tipoVuelo === 'ida-vuelta';
    const cantidadPasajeros = parseInt(datosBusqueda.pasajeros, 10) || 1;
    const asientosOcupadosIda = vuelo.asientosOcupadosIda || generarOcupados(vuelo.id || 'ida', 12);
    const asientosOcupadosVuelta = vuelo.asientosOcupadosVuelta || generarOcupados(vuelo.id || 'vuelta', 10);

    renderizarInformacionVuelos(vuelo, datosBusqueda, esIdaVuelta);

    const contenedorMapas = document.getElementById('contenedor-mapas-asientos');
    contenedorMapas.innerHTML = '';

    contenedorMapas.appendChild(
        crearColumnaConMapa('ida', 'Ida', asientosOcupadosIda, cantidadPasajeros)
    );

    if (esIdaVuelta) {
        contenedorMapas.appendChild(
            crearColumnaConMapa('vuelta', 'Vuelta', asientosOcupadosVuelta, cantidadPasajeros)
        );
    }

    calcularYMostrarPrecios(vuelo, datosBusqueda, esIdaVuelta, cantidadPasajeros);
    restaurarAsientosGuardados(esIdaVuelta);
    configurarBotonContinuar(cantidadPasajeros, esIdaVuelta);
});


//Generador de Asientos Ocupados
function generarOcupados(semilla, cantidad) {
    const letras = ['A', 'B', 'C', 'D', 'E', 'F'];
    const totalFilas = 8;
    const todos = [];
    for (let f = 1; f <= totalFilas; f++) {
        for (const l of letras) todos.push(`${f}${l}`);
    }

    // PRNG simple basado en la semilla (string → número)
    let seed = [...String(semilla)].reduce((acc, c) => acc + c.charCodeAt(0), 0);
    const rand = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };

    const ocupados = [];
    const disponibles = [...todos];
    while (ocupados.length < cantidad && disponibles.length > 0) {
        const idx = Math.floor(rand() * disponibles.length);
        ocupados.push(disponibles.splice(idx, 1)[0]);
    }
    return ocupados;
}

//Detalle de Vuelo
function renderizarInformacionVuelos(vuelo, datosBusqueda, esIdaVuelta) {
    const contenedorInfo = document.getElementById('panel-vuelos-info');

    const cap = (str) => str ? str.charAt(0).toUpperCase() + str.slice(1) : '';
    const origen = cap(datosBusqueda.origen);
    const destino = cap(datosBusqueda.destino);

    const bloqueVuelo = (esVuelta) => `
        <section class="${esVuelta ? 'vuelta-card' : 'ida-card'}">
            <p><strong>${esVuelta ? 'Vuelta' : 'Ida'}</strong> – ${esVuelta ? datosBusqueda.fechaVuelta : datosBusqueda.fechaIda}</p>
            <div class="aerolinea">
                <img src="${vuelo.logo}" alt="${vuelo.aerolinea}">
                <span>${vuelo.aerolinea}</span>
            </div>
            <div class="linea-tiempo">
                <div class="origen">
                    <span class="hora">${vuelo.salida}</span>
                    <span class="codigo">${esVuelta ? vuelo.codigoDestino : vuelo.codigoOrigen}</span>
                    <span class="ciudad">${esVuelta ? destino : origen}</span>
                </div>
                <div class="conexion">
                    <span>${vuelo.tipo}</span>
                    <div class="linea"></div>
                    <span>${vuelo.duracion}</span>
                </div>
                <div class="destino">
                    <span class="hora">${vuelo.llegada}</span>
                    <span class="codigo">${esVuelta ? vuelo.codigoOrigen : vuelo.codigoDestino}</span>
                    <span class="ciudad">${esVuelta ? origen : destino}</span>
                </div>
            </div>
        </section>`;

    //Resumen de Precio
    const resumenHTML = `
        <section class="precio-card" id="desglose-precios-card">
            <h3>Resumen de Precio</h3><br>
            <div class="fila-precio"><span>Pasajeros</span><span id="txt-calc-pasajeros">–</span></div>
            <div class="fila-precio"><span>Tarifa base</span><span id="txt-calc-tarifa">–</span></div>
            <div class="fila-precio"><span>Impuestos</span><span id="txt-calc-impuestos">–</span></div>
            <div class="total"><span>TOTAL</span><span id="txt-calc-total">–</span></div>
        </section>
        <aside class="informacion-card">
            <div class="info-titulo"><i class="fa-solid fa-circle-info"></i><h3>Información</h3></div>
            <p>Seleccioná un asiento por pasajero en cada tramo del viaje antes de continuar.</p>
        </aside>`;

    contenedorInfo.innerHTML =
        bloqueVuelo(false) +
        (esIdaVuelta ? bloqueVuelo(true) : '') +
        resumenHTML;
}

//Columnas del Mapa de Asientos
function crearColumnaConMapa(tipoTramo, tituloLabel, asientosOcupados, cantidadPasajeros) {
    const columna = document.createElement('div');
    columna.className = 'columna-mapa';

    // Título simétrico
    const titulo = document.createElement('p');
    titulo.className = 'titulo-asiento';
    titulo.textContent = 'Seleccioná tu asiento';

    const subtitulo = document.createElement('p');
    subtitulo.className = 'subtitulo-tramo';
    subtitulo.textContent = `Tramo de ${tituloLabel}`;

    columna.appendChild(titulo);
    columna.appendChild(subtitulo);
    columna.appendChild(crearMapa(tipoTramo, tituloLabel, asientosOcupados, cantidadPasajeros));

    return columna;
}

//Mapa de los Asientos
function crearMapa(tipoTramo, tituloLabel, asientosOcupados, cantidadPasajeros) {
    const divMapa = document.createElement('div');
    divMapa.className = 'mapa-asientos';

    // Cabecera de columnas
    const cabecera = document.createElement('div');
    cabecera.className = 'cabecera-columnas';
    cabecera.innerHTML = `
        <span></span>
        <span>A</span><span>B</span><span>C</span>
        <div class="pasillo"></div>
        <span>D</span><span>E</span><span>F</span>
        <span></span>`;

    const frente = document.createElement('div');
    frente.className = 'frente-avion';
    frente.innerHTML = '<span>Frente del avión</span>';

    divMapa.appendChild(frente);
    divMapa.appendChild(cabecera);

    // Filas de asientos
    for (let f = 1; f <= 8; f++) {
        const filaEl = document.createElement('div');
        filaEl.className = 'fila';

        const numIzq = document.createElement('span');
        numIzq.className = 'numero-fila';
        numIzq.textContent = f;
        filaEl.appendChild(numIzq);

        ['A', 'B', 'C', 'D', 'E', 'F'].forEach((letra, idx) => {
            if (idx === 3) {
                const pasillo = document.createElement('div');
                pasillo.className = 'pasillo';
                filaEl.appendChild(pasillo);
            }

            const codigo = `${f}${letra}`;
            const boton = document.createElement('button');
            boton.type = 'button';
            boton.className = 'asiento';
            boton.dataset.codigo = codigo;
            boton.dataset.tramo = tipoTramo;

            if (asientosOcupados.includes(codigo)) {
                boton.classList.add('ocupado');
                boton.setAttribute('aria-label', `Asiento ${codigo} – Ocupado`);
                boton.disabled = true;
            } else {
                boton.setAttribute('aria-label', `Asiento ${codigo} – Disponible`);
                boton.addEventListener('click', () =>
                    gestionarSeleccionAsiento(boton, tipoTramo, cantidadPasajeros)
                );
            }

            filaEl.appendChild(boton);
        });

        const numDer = document.createElement('span');
        numDer.className = 'numero-fila';
        numDer.textContent = f;
        filaEl.appendChild(numDer);

        divMapa.appendChild(filaEl);
    }

    const trasera = document.createElement('div');
    trasera.className = 'trasera-avion';
    trasera.innerHTML = '<span>Parte trasera del avión</span>';
    divMapa.appendChild(trasera);

    return divMapa;
}

//Validacion de Cantidad de Pasajeros por Tramo
function gestionarSeleccionAsiento(boton, tipoTramo, cantidadPasajeros) {
    // Si ya estaba seleccionado → deseleccionar
    if (boton.classList.contains('seleccionado')) {
        boton.classList.remove('seleccionado');
        actualizarEstadoBoton();
        return;
    }

    // Contar seleccionados actuales en este tramo
    const seleccionados = document.querySelectorAll(
        `.asiento.seleccionado[data-tramo="${tipoTramo}"]`
    ).length;

    if (seleccionados < cantidadPasajeros) {
        boton.classList.add('seleccionado');
    } else {
        Swal.fire({
            title: '<i class="fa-solid fa-circle-exclamation" style="color:#2563EB"></i> Máximo alcanzado',
            html: `<p style="font-size:1.5rem">Ya seleccionaste el máximo de <b>${cantidadPasajeros} asiento${cantidadPasajeros > 1 ? 's' : ''}</b> para el tramo de <b>${tipoTramo}</b>.<br><br>Deseleccioná uno si querés cambiar.</p>`,
            confirmButtonText: 'Volver',
            confirmButtonColor: '#2563EB',
            allowOutsideClick: true,
            customClass: { popup: 'swal-detalles' }
        });
    }

    actualizarEstadoBoton();
}

//Funcion de Control de Cantidad de Pasajeros
function actualizarEstadoBoton() {
    const btn = document.getElementById('btn-continuar');
    if (!btn) return;

    const datosBusqueda = JSON.parse(sessionStorage.getItem('ultimaBusqueda'));
    const cantidadPasajeros = parseInt(datosBusqueda.pasajeros, 10) || 1;
    const esIdaVuelta = datosBusqueda.tipoVuelo === 'ida-vuelta';

    const selIda = document.querySelectorAll('.asiento.seleccionado[data-tramo="ida"]').length;
    const selVuelta = document.querySelectorAll('.asiento.seleccionado[data-tramo="vuelta"]').length;

    const idaOk = selIda === cantidadPasajeros;
    const vueltaOk = !esIdaVuelta || selVuelta === cantidadPasajeros;

    btn.disabled = !(idaOk && vueltaOk);
}

//Funcion de Calculo de Precios
function calcularYMostrarPrecios(vuelo, datosBusqueda, esIdaVuelta, cantidadPasajeros) {
    // Precio base individual (ya viene del objeto vuelo)
    let precioBase = parseFloat(vuelo.precio) || 0;

    // Multiplicador de clase
    const clase = (datosBusqueda.clase || 'economy').toLowerCase();
    if (clase === 'business') precioBase *= 1.5;
    else if (clase === 'first') precioBase *= 2;

    // Si es ida y vuelta se duplica
    if (esIdaVuelta) precioBase *= 2;

    // Subtotal tarifa
    const subtotalTarifa = Math.round(precioBase * cantidadPasajeros);

    // Impuestos: 90 USD por persona por tramo (90 ida / 180 ida+vuelta)
    const impuestosPorPersona = esIdaVuelta ? 180 : 90;
    const totalImpuestos = impuestosPorPersona * cantidadPasajeros;

    // Cargo equipaje extra (100 USD por persona si se solicitó)
    const cargoEquipaje = datosBusqueda.equipajeIncluido ? (100 * cantidadPasajeros) : 0;
    const granTotal = subtotalTarifa + totalImpuestos + cargoEquipaje;

    const claseDisplay = clase.charAt(0).toUpperCase() + clase.slice(1);
    document.getElementById('txt-calc-pasajeros').textContent =
        `${cantidadPasajeros} × ${claseDisplay}`;
    document.getElementById('txt-calc-tarifa').textContent = `USD ${subtotalTarifa.toLocaleString('es-AR')}`;
    document.getElementById('txt-calc-impuestos').textContent = `USD ${totalImpuestos.toLocaleString('es-AR')}`;

    //Fila de equipaje (solo si aplica)
    if (cargoEquipaje > 0) {
        const desgloseCard = document.getElementById('desglose-precios-card');
        const divTotal = desgloseCard.querySelector('.total');
        const filaEquipaje = document.createElement('div');
        filaEquipaje.className = 'fila-precio';
        filaEquipaje.innerHTML = `
            <span>Equipaje extra</span>
            <span>USD ${cargoEquipaje.toLocaleString('es-AR')}</span>`;
        desgloseCard.insertBefore(filaEquipaje, divTotal);
    }

    document.getElementById('txt-calc-total').textContent = `USD ${granTotal.toLocaleString('es-AR')}`;

    //Persistir resumen para el checkout
    localStorage.setItem('resumenVuelo', JSON.stringify({
        tarifa: subtotalTarifa,
        impuestos: totalImpuestos,
        equipaje: cargoEquipaje,
        total: granTotal,
        pasajeros: cantidadPasajeros,
        clase: clase
    }));
}

//Funcion que Recupera los Asientos Guardados
function restaurarAsientosGuardados(esIdaVuelta) {
    const raw = sessionStorage.getItem('asientosSeleccionados');
    if (!raw) return;

    let mapa;
    try { mapa = JSON.parse(raw); } catch { return; }

    const restaurar = (codigos, tramo) => {
        if (!Array.isArray(codigos)) return;
        codigos.forEach(codigo => {
            const boton = document.querySelector(
                `.asiento[data-tramo="${tramo}"][data-codigo="${codigo}"]`
            );
            if (boton && !boton.classList.contains('ocupado')) {
                boton.classList.add('seleccionado');
            }
        });
    };

    restaurar(mapa.ida, 'ida');
    if (esIdaVuelta) restaurar(mapa.vuelta, 'vuelta');
    actualizarEstadoBoton();
}


//Boton de Continuar
function configurarBotonContinuar(cantidadPasajeros, esIdaVuelta) {
    const btn = document.getElementById('btn-continuar');
    if (!btn) return;

    btn.addEventListener('click', () => {
        const ida = [...document.querySelectorAll('.asiento.seleccionado[data-tramo="ida"]')]
            .map(a => a.dataset.codigo);
        const vuelta = [...document.querySelectorAll('.asiento.seleccionado[data-tramo="vuelta"]')]
            .map(a => a.dataset.codigo);

        // Guardar en sessionStorage para recuperar al volver
        sessionStorage.setItem('asientosSeleccionados', JSON.stringify({
            ida,
            vuelta: esIdaVuelta ? vuelta : []
        }));

        window.location.href = '../checkout/pasajeros.html';
    });
}