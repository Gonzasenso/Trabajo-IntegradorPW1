document.addEventListener("DOMContentLoaded", function () {
    const formulario = document.getElementById("form-contacto");
    const modal = document.getElementById("modal-exito");

    if (!formulario) return;

    formulario.addEventListener("submit", function (evento) {
        evento.preventDefault(); // --> NO BORRAR, es para que la pagina no se recargue de forma automática

        const nuevoMensaje = {
            nombre: document.getElementById("nombre").value,
            email: document.getElementById("email").value,
            telefono: document.getElementById("telefono").value,
            mensaje: document.getElementById("mensaje").value,
            fecha: new Date().toLocaleString()
        };

        //Busca los mensajes anteriores o crea el array
        const listaMensajes = JSON.parse(localStorage.getItem("contacto_mensajes")) || [];

        listaMensajes.push(nuevoMensaje);
        localStorage.setItem("contacto_mensajes", JSON.stringify(listaMensajes));
        formulario.reset(); // ---> Resetea el formulario una vez enviado
        modal.classList.add("mostrar"); // ---> NO TOCAR, es el Pop Up

        //Funcion de Redirección al Home
        setTimeout(function () {
            window.location.href = "../../index.html";
        }, 3000);
    });
});