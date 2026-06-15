// ========== SELECCIÓN DE ASIENTOS ==========

// 1. Seleccionamos TODOS los elementos que tengan la clase "asiento"
// querySelectorAll devuelve una lista (NodeList) con todos los asientos del mapa
const asientos = document.querySelectorAll('.asiento');

// 2. Recorremos cada asiento con forEach para agregarle un evento de click
asientos.forEach((asiento) => {

    // 3. A cada asiento le agregamos un "escuchador" de eventos de tipo "click"
    asiento.addEventListener('click', () => {

        // 4. Si el asiento clickeado tiene la clase "ocupado", no hacemos nada
        // El return acá corta la ejecución de la función y no sigue de largo
        if (asiento.classList.contains('ocupado')) {
            return;
        }

        // 5. Buscamos si hay OTRO asiento que ya tenga la clase "seleccionado"
        const asientoSeleccionado = document.querySelector('.asiento.seleccionado');

        // 6. Si existe un asiento seleccionado previo, le quitamos la clase
        if (asientoSeleccionado) {
            asientoSeleccionado.classList.remove('seleccionado');
        }

        // 7. Le agregamos la clase "seleccionado" al asiento que acabamos de clickear
        asiento.classList.add('seleccionado');
    });
});


// ========== VALIDACIÓN DEL BOTÓN CONTINUAR ==========

// 8. Seleccionamos el botón "Continuar" (es un <a>, no un <button>)
const botonContinuar = document.querySelector('.botonContinuar');

// 9. Le agregamos un evento de click
botonContinuar.addEventListener('click', (e) => {

    // 10. Buscamos si hay algún asiento con la clase "seleccionado"
    const asientoSeleccionado = document.querySelector('.asiento.seleccionado');

    // 11. Si NO hay ningún asiento seleccionado...
    if (!asientoSeleccionado) {
        // e.preventDefault() evita que el link funcione y redirija a otra página
        e.preventDefault();

        // Le avisamos al usuario que falta seleccionar un asiento
        alert('Por favor, seleccioná un asiento antes de continuar.');
    }

    // Si SÍ hay un asiento seleccionado, no hacemos nada y el link funciona normal
});