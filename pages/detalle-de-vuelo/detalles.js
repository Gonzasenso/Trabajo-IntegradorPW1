//CONFIGURACIÓN

/**
 * Obtiene los datos de la búsqueda global desde sessionStorage.
 */
const getDatosBusqueda = () => {
    const busqueda = sessionStorage.getItem('ultimaBusqueda');
    return busqueda ? JSON.parse(busqueda) : null;
};

document.addEventListener('DOMContentLoaded', () => {
    const datosBusqueda = getDatosBusqueda();
    
    // Cantidad real de pasajeros (por defecto 1)
    const cantidadMaxPasajeros = datosBusqueda ? parseInt(datosBusqueda.pasajeros, 10) : 1;

    // CÁLCULO DE PRECIOS 
    
    // Identificamos las páginas por su nombre de archivo para saber qué precio base usar
    const paginaActual = window.location.pathname;
    let precioBaseVuelo = 900; // Por defecto Madrid 1 (Air Europa)

    if (paginaActual.includes('detalle-de-vuelo-madrid3.html')) {
        precioBaseVuelo = 1000; // Iberia
    } else if (paginaActual.includes('detalle-de-vuelo-madrid2.html')) {
        precioBaseVuelo = 700;  // LATAM
    }

    // Aplicamos la formula parecida a resultados.js
    let precioTarifaIndividual = precioBaseVuelo;

    // Multiplicador por Clase
    if (datosBusqueda && datosBusqueda.clase === "business") {
        precioTarifaIndividual *= 1.5;
    } else if (datosBusqueda && datosBusqueda.clase === "first") {
        precioTarifaIndividual *= 2;
    }

    // Calculamos los totales finales multiplicando por los pasajeros reales
    const tarifaTotalCalculada = Math.round(precioTarifaIndividual * cantidadMaxPasajeros);
    
    // Supongamos un valor fijo de impuestos base por persona
    const impuestosBasePersona = 90; 
    const impuestosTotalesCalculados = impuestosBasePersona * cantidadMaxPasajeros;
    
    const granTotalCalculado = tarifaTotalCalculada + impuestosTotalesCalculados
   localStorage.setItem(
    "resumenVuelo",
    JSON.stringify({
        tarifa: tarifaTotalCalculada,
        impuestos: impuestosTotalesCalculados,
        total: granTotalCalculado,
        pasajeros: cantidadMaxPasajeros
    })
);

console.log("RESUMEN GUARDADO");
console.log(localStorage.getItem("resumenVuelo"));

    // Seleccionamos las filas del contenedor .precio-card
    const filasPrecio = document.querySelectorAll('.precio-card .fila-precio');
    const contenedorTotal = document.querySelector('.precio-card .total span:last-child');

    if (filasPrecio.length >= 3) {
        // Fila 1: Cantidad de pasajeros e indicador
        filasPrecio[0].querySelector('span:first-child').textContent = `${cantidadMaxPasajeros} ${cantidadMaxPasajeros === 1 ? 'pasajero' : 'pasajeros'}`;
        filasPrecio[0].querySelector('span:last-child').textContent = `USD ${tarifaTotalCalculada}`;

        // Fila 2: Desglose de Tarifa pura
        filasPrecio[1].querySelector('span:last-child').textContent = `USD ${tarifaTotalCalculada}`;

        // Fila 3: Impuestos dinámicos
        filasPrecio[2].querySelector('span:last-child').textContent = `USD ${impuestosTotalesCalculados}`;
        
        // Fila Final: TOTAL 
        if (contenedorTotal) {
            contenedorTotal.textContent = `USD ${granTotalCalculado}`;
        }
    }

    // SELECCIÓN DE MÚLTIPLES ASIENTOS
    const asientos = document.querySelectorAll('.asiento');
    const letras = ["A", "B", "C", "D", "E", "F"];

document.querySelectorAll(".fila").forEach((fila) => {

    const numeroFila =
        fila.querySelector(".numero-fila")?.textContent.trim();

    const asientosFila =
        fila.querySelectorAll(".asiento");

    asientosFila.forEach((asiento, indice) => {

        asiento.dataset.codigo =
            numeroFila + letras[indice];

    });
});

    asientos.forEach((asiento) => {
        asiento.addEventListener('click', () => {
            if (asiento.classList.contains('ocupado')) {
                return;
            }

            if (asiento.classList.contains('seleccionado')) {
                asiento.classList.remove('seleccionado');
                return;
            }

            const asientosSeleccionadosActualmente = document.querySelectorAll('.asiento.seleccionado').length;

            if (asientosSeleccionadosActualmente < cantidadMaxPasajeros) {
                asiento.classList.add('seleccionado');
            } else {
                alert(`Tu búsqueda es para ${cantidadMaxPasajeros} ${cantidadMaxPasajeros === 1 ? 'pasajero' : 'pasajeros'}. Ya seleccionaste el máximo de asientos permitido.`);
            }
        });
    });

    
const botonContinuar =
    document.querySelector('.botonContinuar');

// ACA SE GUARDAN LOS ASIENTOS
if (botonContinuar) {
    botonContinuar.addEventListener('click', () => {

        const asientosSeleccionados =
            [...document.querySelectorAll('.asiento.seleccionado')]
            .map(a => a.dataset.codigo);
        console.log(asientosSeleccionados);

        sessionStorage.setItem(
            "asientosSeleccionados",
            JSON.stringify(asientosSeleccionados)
        )
    })
}
});