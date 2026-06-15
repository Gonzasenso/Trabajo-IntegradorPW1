// SELECCIÓN DE ASIENTOS

// Seleccionamos TODOS los elementos que tengan la clase "asiento"
const asientos = document.querySelectorAll('.asiento');

// Recorremos cada asiento con forEach para agregarle un evento de click
asientos.forEach((asiento) => {

    // A cada asiento le agregamos un "escuchador" de eventos de tipo "click"
    asiento.addEventListener('click', () => {

        // Si el asiento clickeado tiene la clase "ocupado", no hacemos nada
        if (asiento.classList.contains('ocupado')) {
            return;
        }

        // Buscamos si hay OTRO asiento que ya tenga la clase "seleccionado"
        const asientoSeleccionado = document.querySelector('.asiento.seleccionado');

        // Si existe un asiento seleccionado previo, le quitamos la clase
        if (asientoSeleccionado) {
            asientoSeleccionado.classList.remove('seleccionado');
        }

        // Le agregamos la clase "seleccionado" al asiento que acabamos de clickear
        asiento.classList.add('seleccionado');
    });
});


//VALIDACIÓN DEL BOTÓN CONTINUAR 

// Seleccionamos el botón "Continuar"
const botonContinuar = document.querySelector('.botonContinuar');

// Le agregamos un evento de click
botonContinuar.addEventListener('click', (e) => {

    // Buscamos si hay algún asiento con la clase "seleccionado"
    const asientoSeleccionado = document.querySelector('.asiento.seleccionado');

    // Si NO hay ningún asiento seleccionado...
    if (!asientoSeleccionado) {
        e.preventDefault();
        alert('Por favor, seleccioná un asiento antes de continuar.');
    }
});