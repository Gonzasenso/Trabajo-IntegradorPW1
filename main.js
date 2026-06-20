// Formulario del Buscador de Vuelos
const formBuscador = document.getElementById("form-buscador");
const inputOrigen = document.getElementById("desde");
const inputDestino = document.getElementById("hacia");
const inputIda = document.getElementById("fecha-ida");
const inputVuelta = document.getElementById("fecha-vuelta");
const selectPasajeros = document.getElementById("pasajeros");
const selectClase = document.getElementById("clase");

// Botones del Buscador
const btnIdaVuelta = document.getElementById("btn-ida-vuelta");
const btnSoloIda = document.getElementById("btn-solo-ida");
const contenedorVuelta = document.getElementById("contenedor-vuelta");
let tipoVuelo = "ida-vuelta";

// Control de los Botones del Buscador
btnIdaVuelta.addEventListener("click", () => {
    btnIdaVuelta.classList.add("activo");
    btnSoloIda.classList.remove("activo");
    contenedorVuelta.style.display = "flex";
    inputVuelta.required = true;
    tipoVuelo = "ida-vuelta";
});

btnSoloIda.addEventListener("click", () => {
    btnSoloIda.classList.add("activo");
    btnIdaVuelta.classList.remove("activo");
    contenedorVuelta.style.display = "none";
    inputVuelta.required = false;
    inputVuelta.value = "";
    tipoVuelo = "solo-ida";
});

// Recuperar ultima busqueda
const ultimaBusqueda =
    JSON.parse(
        sessionStorage.getItem(
            "ultimaBusqueda"
        )
    );

if (ultimaBusqueda) {

    inputOrigen.value =
        ultimaBusqueda.origen;

    inputDestino.value =
        ultimaBusqueda.destino;

    inputIda.value =
        ultimaBusqueda.fechaIda;

    if (
        ultimaBusqueda.tipoVuelo ===
        "ida-vuelta"
    ) {

        inputVuelta.value =
            ultimaBusqueda.fechaVuelta;

    }
    if (ultimaBusqueda.tipoVuelo === "solo-ida") {

        btnSoloIda.click();

    } else {

        btnIdaVuelta.click();

        inputVuelta.value =
            ultimaBusqueda.fechaVuelta;
    }

    selectPasajeros.value =
        ultimaBusqueda.pasajeros;

    selectClase.value =
        ultimaBusqueda.clase;

}

// Submit del Buscador
formBuscador.addEventListener("submit", function (e) {
    e.preventDefault();

    if (!inputOrigen.value || !inputDestino.value || !inputIda.value || (tipoVuelo === "ida-vuelta" && !inputVuelta.value)) {
        alert("Por favor, complete todos los campos obligatorios.");
        return;
    }

    const origen = inputOrigen.value.trim().toLowerCase();
    const destino = inputDestino.value.trim().toLowerCase();

    if (origen === destino) {
        alert("El origen y el destino no pueden ser iguales. Por favor, modifique su búsqueda.");
        inputDestino.focus();
        return;
    }

    const fechaIda = new Date(inputIda.value);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    if (fechaIda < hoy) {
        alert("La fecha de ida no puede ser anterior al día de hoy.");
        inputIda.focus();
        return;
    }

    if (tipoVuelo === "ida-vuelta") {
        const fechaVuelta = new Date(inputVuelta.value);
        if (fechaVuelta < fechaIda) {
            alert("La fecha de vuelta no puede ser anterior a la fecha de ida.");
            inputVuelta.focus();
            return;
        }
    }

    const regexLetras = /^[a-zA-Z\sñáéíóúÁÉÍÓÚ]+$/;
    if (!regexLetras.test(origen) || !regexLetras.test(destino)) {
        alert("Los campos de ciudad/aeropuerto solo deben contener letras.");
        return;
    }

    const busquedaUsuario = {
        origen: inputOrigen.value.trim(),
        destino: inputDestino.value.trim(),
        fechaIda: inputIda.value,
        fechaVuelta: tipoVuelo === "ida-vuelta" ? inputVuelta.value : "Solo Ida",
        pasajeros: selectPasajeros.value,
        clase: selectClase.value,
        tipoVuelo: tipoVuelo
    };

    sessionStorage.setItem("ultimaBusqueda", JSON.stringify(busquedaUsuario));
    window.location.href = "./pages/resultados-de-busqueda/filtro-1.html";
});

// Cada vez que se inicia una búsqueda nueva, se invalida cualquier confirmación previa
sessionStorage.setItem("ultimaBusqueda", JSON.stringify(busquedaUsuario));
sessionStorage.removeItem("reservaConfirmada");
window.location.href = "./pages/resultados-de-busqueda/filtro-1.html";