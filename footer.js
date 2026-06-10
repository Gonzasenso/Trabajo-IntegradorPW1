renderFooter();

function renderFooter() {
    const footerContainer = document.getElementById("contacto-footer");

    if (!footerContainer) return;

    // Detecta si la página actual está en una subcarpeta de /pages ---> Validacion 1
    const esSubcarpeta = window.location.pathname.includes("/pages/");
    const prefijo = esSubcarpeta ? "../../" : "./";

    // Validaciones de Rutas (Evita las rutas circulares rotas) ---> Validacion 2
    const enPerfil = window.location.pathname.includes("/perfil/") || window.location.pathname.includes("/perfil_de_usuario/");
    const enFooterPages = window.location.pathname.includes("/pages_footer/");

    //Ruteo del Footer
    const rutaHistoria = enFooterPages ? "./historia.html" : `${prefijo}pages/pages_footer/historia.html`;
    const rutaContacto = enFooterPages ? "./contacto.html" : `${prefijo}pages/pages_footer/contacto.html`;
    const rutaPreguntas = enFooterPages ? "./preguntas_frecuentes.html" : `${prefijo}pages/pages_footer/preguntas_frecuentes.html`;
    const rutaPerfil = enPerfil ? "./perfil_de_usuario.html" : `${prefijo}pages/perfil_de_usuario/perfil_de_usuario.html`;
    const rutaReservas = enPerfil ? "./reservas.html" : `${prefijo}pages/perfil_de_usuario/reservas.html`;

    footerContainer.style.background = `linear-gradient(rgba(12, 23, 53, 0.9), rgba(12, 23, 53, 0.9)), url(${prefijo}img/footer.png) no-repeat center center/cover`;

    footerContainer.innerHTML = `
        <div class="footer-container">
            <div class="footer-header">
                <div class="footer-logo">
                    <a href="#top"><img src="${prefijo}img/fly_lena_logo_grande.png" alt="Logo" class="logo-img"></a>
                </div>
                <div class="footer-socials">
                    <a href="https://www.instagram.com/despegar.ar/" target="_blank" rel="noopener noreferrer"><img src="${prefijo}img/iconos/icono_ig.png" alt="Instagram"></a>
                    <a href="https://www.facebook.com/DespegarArgentina/" target="_blank" rel="noopener noreferrer"><img src="${prefijo}img/iconos/icono_fb.png" alt="Facebook"></a>
                    <a href="https://www.tiktok.com/@despegar.ar" target="_blank" rel="noopener noreferrer"><img src="${prefijo}img/iconos/icono_tiktok.png" alt="Tik Tok"></a>
                    <a href="https://x.com/Despegar" target="_blank" rel="noopener noreferrer"><img src="${prefijo}img/iconos/icono_X.png" alt="X"></a>
                </div>
            </div>

            <div class="footer-columns">
                <div class="column">
                    <h3>Sobre Nosotros</h3>
                    <a href="${rutaHistoria}">Historia</a>
                    <a href="https://www.linkedin.com/company/despegar/" target="_blank" rel="noopener noreferrer">Trabajá con nosotros</a>
                </div>
                <div class="column">
                    <h3>Mi Cuenta</h3>
                    <a href="${rutaPerfil}">Perfil de Usuario</a>
                    <a href="${rutaReservas}">Mis Reservas</a>
                </div>
                <div class="column">
                    <h3>Atención al Cliente</h3>
                    <a href="${rutaContacto}">Contacto</a>
                    <a href="${rutaPreguntas}">Preguntas Frecuentes</a>
                </div>
            </div>

            <div class="footer-bottom">
                <p>© 2026 Fly Lena S.R.L. Todos los derechos reservados ©.</p>
                <div class="legal-links">
                    <a href="${prefijo}assets/Terminos de Uso y Conditions.pdf" target="_blank">Términos y condiciones</a>
                    <a href="${prefijo}assets/Politica de Privacidad.pdf" target="_blank">Privacidad</a>
                    <a href="https://www.argentina.gob.ar/economia/industria-y-comercio/defensadelconsumidor" target="_blank">Defensa del Consumidor</a>
                </div>
            </div>
        </div>
    `;
}