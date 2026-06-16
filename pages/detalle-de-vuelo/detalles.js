// CONFIGURACIÓN 

/**
 * Obtiene los datos de la búsqueda global (pasajeros, clase, etc.) desde sessionStorage.
 */
const getDatosBusqueda = () => {
    const busqueda = sessionStorage.getItem('ultimaBusqueda');
    return busqueda ? JSON.parse(busqueda) : null;
};

document.addEventListener('DOMContentLoaded', () => {
    const datosBusqueda = getDatosBusqueda();
    
    // Obtenemos cuántos pasajeros seleccionó el usuario (por defecto 1)
    const cantidadMaxPasajeros = datosBusqueda ? parseInt(datosBusqueda.pasajeros, 10) : 1;

    // CÁLCULO DE PRECIOS 

    // Seleccionamos las filas de precio reales de tu nueva tarjeta estructural
    const filasPrecio = document.querySelectorAll('.precio-card .fila-precio');
    const contenedorTotal = document.querySelector('.precio-card .total span:last-child');

    if (filasPrecio.length >= 3) {
        // 1. Fila de indicador de pasajeros: "1 pasajero" -> "X pasajeros"
        const labelPasajeros = filasPrecio[0].querySelector('span:first-child');
        const valorPasajerosBase = filasPrecio[0].querySelector('span:last-child');
        if (labelPasajeros) {
            labelPasajeros.textContent = `${cantidadMaxPasajeros} ${cantidadMaxPasajeros === 1 ? 'pasajero' : 'pasajeros'}`;
        }

        // 2. Extraer los costos unitarios base escritos en el HTML 
        const precioTarifaBase = parseInt(valorPasajerosBase.textContent.replace(/[^0-9]/g, ''), 10) || 530;
        const precioImpuestosBase = parseInt(filasPrecio[2].querySelector('span:last-child').textContent.replace(/[^0-9]/g, ''), 10) || 90;

        // 3. Multiplicar los valores base por la cantidad real de pasajeros
        const tarifaCalculada = precioTarifaBase * cantidadMaxPasajeros;
        const impuestosCalculados = precioImpuestosBase * cantidadMaxPasajeros;
        const totalCalculado = tarifaCalculada + impuestosCalculados;

        // 4. Nuevos valores 
        filasPrecio[0].querySelector('span:last-child').textContent = `USD ${tarifaCalculada}`;
        filasPrecio[1].querySelector('span:last-child').textContent = `USD ${tarifaCalculada}`;
        filasPrecio[2].querySelector('span:last-child').textContent = `USD ${impuestosCalculados}`;
        
        if (contenedorTotal) {
            contenedorTotal.textContent = `USD ${totalCalculado}`;
        }
    }

    // SELECCIÓN DE MÚLTIPLES ASIENTOS
    const asientos = document.querySelectorAll('.asiento');

    asientos.forEach((asiento) => {
        asiento.addEventListener('click', () => {
            // Si el asiento ya está ocupado por defecto, no hace nada
            if (asiento.classList.contains('ocupado')) {
                return;
            }

            // Si el asiento ya estaba seleccionado por este usuario, lo deselecciona
            if (asiento.classList.contains('seleccionado')) {
                asiento.classList.remove('seleccionado');
                return;
            }

            // Contamos cuantos asientos tiene seleccionados el usuario actualmente en el mapa
            const asientosSeleccionadosActualmente = document.querySelectorAll('.asiento.seleccionado').length;

            // Validamos: si aún no llego al límite, hacemos que seleccione uno nuevo
            if (asientosSeleccionadosActualmente < cantidadMaxPasajeros) {
                asiento.classList.add('seleccionado');
            } else {
                alert(`Tu búsqueda es para ${cantidadMaxPasajeros} ${cantidadMaxPasajeros === 1 ? 'pasajero' : 'pasajeros'}. Ya seleccionaste el máximo de asientos permitido.`);
            }
        });
    });

    // VALIDACIÓN ANTES DE CONTINUAR 
    const botonContinuar = document.querySelector('.botonContinuar');

    if (botonContinuar) {
        botonContinuar.addEventListener('click', (e) => {
            const asientosSeleccionadosFinal = document.querySelectorAll('.asiento.seleccionado').length;

            // Si seleccionó menos asientos que la cantidad de pasajeros, bloqueamos el avance
            if (asientosSeleccionadosFinal < cantidadMaxPasajeros) {
                e.preventDefault(); 
                
                const faltantes = cantidadMaxPasajeros - asientosSeleccionadosFinal;
                alert(`Debes seleccionar los asientos para todos los pasajeros. Te falta elegir ${faltantes} ${faltantes === 1 ? 'asiento' : 'asientos'}.`);
            }
        });
    }
});