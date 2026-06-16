/**
 * Si no hay nada guardado (por ejemplo, si entran directo a la página), por defecto es 1.
 */
const getPasajeros = () => {
    const pasajeros = sessionStorage.getItem('pasajeros_vuelo');
    return pasajeros ? parseInt(pasajeros, 10) : 1;
};

document.addEventListener('DOMContentLoaded', () => {
    // Almacenamos cuántos pasajeros seleccionó el usuario
    const cantidadMaxPasajeros = getPasajeros();

    // PRECIOS 
    // Buscamos la etiqueta de precio fuerte dentro de la tarjeta de detalles
    const elementoPrecioFuerte = document.querySelector('.precio strong');
    
    if (elementoPrecioFuerte) {
        // Extraemos el valor numérico (ej: de "USD 620" extrae 620)
        const textoPrecio = elementoPrecioFuerte.textContent;
        const precioBaseUnidad = parseInt(textoPrecio.replace(/[^0-9]/g, ''), 10);

        // Si el número es válido, lo multiplicamos por la cantidad de pasajeros
        if (!isNaN(precioBaseUnidad)) {
            const precioCalculadoTotal = precioBaseUnidad * cantidadMaxPasajeros;
            elementoPrecioFuerte.textContent = `USD ${precioCalculadoTotal}`;
        }
    }

    // SELECCIÓN DE ASIENTOS 
    const asientos = document.querySelectorAll('.asiento');

    asientos.forEach((asiento) => {
        asiento.addEventListener('click', () => {
            // Si el asiento ya está ocupado por defecto, no hacemos nada
            if (asiento.classList.contains('ocupado')) {
                return;
            }

            // Si el asiento ya estaba seleccionado por este usuario, lo deseleccionamos
            if (asiento.classList.contains('seleccionado')) {
                asiento.classList.remove('seleccionado');
                return;
            }

            // Contamos cuantos asientos tiene seleccionados el usuario actualmente en el mapa
            const asientosSeleccionadosActualmente = document.querySelectorAll('.asiento.seleccionado').length;

            // Validamos: si aún no llego al límite de sus pasajeros, le permitimos seleccionar uno más
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

            // Si selecciono menos asientos que la cantidad de pasajeros, bloqueamos el avance
            if (asientosSeleccionadosFinal < cantidadMaxPasajeros) {
                e.preventDefault(); 
                
                const faltantes = cantidadMaxPasajeros - asientosSeleccionadosFinal;
                alert(`Debes seleccionar los asientos para todos los pasajeros. Te falta elegir ${faltantes} ${faltantes === 1 ? 'asiento' : 'asientos'}.`);
            }
        });
    }
});