const ofertas = [
    {
        destino: "Madrid",
        precio: 900,
        imagen: "../../img/imagenMadrid.png",
        descripcion: "Viajá a Europa con precio especial por tiempo limitado.",
        equipajeIncluido: true
    },
    {
        destino: "Rio de Janeiro",
        precio: 280,
        imagen: "../../img/imagenRioDeJaneiro.png",
        descripcion:
            "Escapada ideal para disfrutar playa, sol y descanso."
    },
    {
        destino: "Cancun",
        precio: 700,
        imagen: "../../img/imagenCancun.png",
        descripcion: "Promoción especial para viajes en temporada baja.",
        equipajeIncluido: true
    },
    {
        destino: "Roma",
        precio: 740,
        imagen: "../../img/imagenRoma.png",
        descripcion:
            "Descubrí la historia, la arquitectura y la gastronomía italiana."
    },
    {
        destino: "Maldivias",
        precio: 1890,
        imagen: "../../img/imagenMaldivias.png",
        descripcion:
            "Playas paradisíacas, agua cristalina y resorts de lujo."
    },
    {
        destino: "Tokio",
        precio: 1200,
        imagen: "../../img/imagenTokio.png",
        descripcion: "Tradición y tecnología se combinan en una de las ciudades más fascinantes del mundo.",
        equipajeIncluido: true
    },
];

const contenedor =
    document.querySelector(
        "#contenedorOfertas"
    );

ofertas.forEach(oferta => {

    contenedor.innerHTML += `

    <article class="cardOfertaPagina">

        <img
            src="${oferta.imagen}"
            alt="${oferta.destino}"
        >

        <div class="contenidoOferta">

            <h2>
                Buenos Aires → ${oferta.destino}
            </h2>

            <p>
                ${oferta.descripcion}
            </p>

            <div class="footerOferta">

                <div>
                    <span>Desde</span>
                    <strong>
                        USD ${oferta.precio}
                    </strong>
                </div>

                <a
                    href="#"
                    class="btnOferta"
                    data-destino="${oferta.destino}"
                >
                    Ver oferta
                </a>

            </div>

        </div>

    </article>

    `;
});

document
    .querySelectorAll(".btnOferta")
    .forEach(btn => {

        btn.addEventListener(
            "click",
            (e) => {

                e.preventDefault();

                sessionStorage.setItem(
                    "ultimaBusqueda",
                    JSON.stringify({
                        origen: "Buenos Aires",
                        destino: btn.dataset.destino,
                        fechaIda: "2026-07-10",
                        fechaVuelta: "2026-07-20",
                        pasajeros: "1",
                        clase: "economica",
                        equipajeIncluido: true
                    })
                );

                window.location.href =
                    "../resultados-de-busqueda/filtro-1.html";

            });

    });