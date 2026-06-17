// Control de Usuario Conectado/Desconectado
if (sessionStorage.getItem("isLoggedIn") === null) {
    sessionStorage.setItem("isLoggedIn", "false");
    sessionStorage.setItem("userName", "");
}

let hamburgerClick = false; // ← fuera de todo, scope global

function inicializarNavbar() {
    const isLoggedIn = sessionStorage.getItem("isLoggedIn") === "true";
    const userName = sessionStorage.getItem("userName") || "";
    const displayName = sessionStorage.getItem("displayName") || userName;

    const navLinksContainer = document.getElementById("nav-links");
    const userContainer = document.getElementById("user-container");

    if (!navLinksContainer || !userContainer) return;

    const esSubcarpeta = window.location.pathname.includes("/pages/");
    const prefijo = esSubcarpeta ? "../../" : "./";
    const enPerfil = window.location.pathname.includes("/perfil_de_usuario/");

    if (isLoggedIn) {
        const listaUsuariosNav = JSON.parse(localStorage.getItem("usuariosRegistrados")) || [];
        const datosUsuarioNav = listaUsuariosNav.find(
            u => u.username && u.username.toLowerCase() === userName.toLowerCase()
        );
        const fotoNavbar = (datosUsuarioNav && datosUsuarioNav.avatar)
            ? datosUsuarioNav.avatar
            : `${prefijo}img/perfil_defecto.gif`;

        navLinksContainer.innerHTML = `
            <li><a href="${prefijo}index.html">Inicio</a></li>
            <li><a href="${prefijo}pages/ofertas/ofertas.html">Ofertas</a></li>
            <li><a href="#contacto-footer">Ayuda</a></li>
        `;

        const rutaPerfil = enPerfil ? "./perfil_de_usuario.html" : `${prefijo}pages/perfil_de_usuario/perfil_de_usuario.html`;
        const rutaReservas = enPerfil ? "./reservas.html" : `${prefijo}pages/perfil_de_usuario/reservas.html`;

        userContainer.innerHTML = `
            <div class="perfil-dropdown-wrapper">
                <button class="dropdown-trigger" id="dropdownBtn">
                    <h2 class="nombre">¡Hola, ${displayName}!</h2>
                    <img src="${fotoNavbar}" alt="Perfil">
                    <i class="fa-solid fa-chevron-down"></i>
                </button>
                <div class="dropdown-menu" id="dropdownMenu">
                    <a href="${rutaPerfil}"><i class="fa-solid fa-user"></i>Perfil de Usuario</a>
                    <a href="${rutaReservas}"><i class="fa-solid fa-plane-departure"></i>Mis Reservas</a>
                    <hr>
                    <a href="#" id="logoutBtn" class="logout-link"><i class="fa-solid fa-right-from-bracket"></i>Cerrar Sesión</a>
                </div>
            </div>
        `;

        document.getElementById("dropdownBtn")?.addEventListener("click", function (e) {
            e.stopPropagation();
            document.getElementById("dropdownMenu").classList.toggle("show");
        });

        document.getElementById("logoutBtn")?.addEventListener("click", function (e) {
            e.preventDefault();
            sessionStorage.setItem("isLoggedIn", "false");
            sessionStorage.setItem("userName", "");
            sessionStorage.removeItem("displayName");
            window.location.href = `${prefijo}index.html`;
        });

    } else {
        navLinksContainer.innerHTML = `
            <li><a href="${prefijo}index.html">Inicio</a></li>
            <li><a href="${prefijo}pages/ofertas/ofertas.html">Ofertas</a></li>
            <li><a href="${prefijo}pages/registro_&_login/registro_de_cuenta.html">Registrarse</a></li>
            <li><a href="${prefijo}pages/registro_&_login/login.html">Conectarse</a></li>
            <li><a href="#contacto-footer">Ayuda</a></li>
        `;
        userContainer.innerHTML = "";
    }

    const hamburgerBtn = document.getElementById("hamburger-btn");
    if (hamburgerBtn) {
        hamburgerBtn.addEventListener("click", function () {
            hamburgerClick = true;
            navLinksContainer.classList.toggle("open");
            setTimeout(() => { hamburgerClick = false; }, 0);
        });
    }
}

// Listener global
document.addEventListener("click", function (e) {
    const dropdown = document.getElementById("dropdownMenu");
    if (dropdown && dropdown.classList.contains("show") && !e.target.closest(".perfil-dropdown-wrapper")) {
        dropdown.classList.remove("show");
    }

    const nav = document.getElementById("nav-links");
    if (nav && nav.classList.contains("open") && !hamburgerClick && !e.target.closest("#nav-links")) {
        nav.classList.remove("open");
    }
});

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", inicializarNavbar);
} else {
    inicializarNavbar();
}