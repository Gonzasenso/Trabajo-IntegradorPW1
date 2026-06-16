document.addEventListener('DOMContentLoaded', function() {
    inicializarAcordeones();
    abrirAcordeón(0);
});

function inicializarAcordeones() {
    const headers = document.querySelectorAll('.acordion-header');
    headers.forEach(header => {
        header.addEventListener('click', function() {
            const numeroAcordeón = this.getAttribute('data-acordion');
            toggleAcordeón(numeroAcordeón);
        });
    });
}


function toggleAcordeón(numero) {
    const header = document.querySelector(`[data-acordion="${numero}"]`);
    const contenido = document.getElementById(`acordion-${numero}`);
    const estaAbierto = header.classList.contains('active');
    if (estaAbierto) {
        cerrarAcordeón(numero);
    }else {
        cerrarTodosLosAcordeones();
        abrirAcordeón(numero);
    }
}

function abrirAcordeón(numero) {
    const header = document.querySelector(`[data-acordion="${numero}"]`);
    const contenido = document.getElementById(`acordion-${numero}`);
    header.classList.add('active');
    contenido.classList.add('active');
}

function cerrarAcordeón(numero) {
    const header = document.querySelector(`[data-acordion="${numero}"]`);
    const contenido = document.getElementById(`acordion-${numero}`);
    header.classList.remove('active');
    contenido.classList.remove('active');
}

function cerrarTodosLosAcordeones() {
    const headers = document.querySelectorAll('.acordion-header');
    const contenidos = document.querySelectorAll('.acordion-content');
    headers.forEach(header => {
        header.classList.remove('active');
    });
    contenidos.forEach(contenido => {
        contenido.classList.remove('active');
    });
}