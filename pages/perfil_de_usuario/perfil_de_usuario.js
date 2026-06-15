document.addEventListener("DOMContentLoaded", function () {
    // Valida que el usuario esté realmente conectado (Evita que copie o escriba la URL a Mano)
    const isLoggedIn = sessionStorage.getItem("isLoggedIn") === "true";
    const currentSessionUser = sessionStorage.getItem("userName");
    const displayName = sessionStorage.getItem("displayName");
    const txtClase = document.getElementById("perf-clase");
    const txtEquipaje = document.getElementById("perf-equipaje");

    if (!isLoggedIn || !currentSessionUser) {
        alert("Acceso denegado. Por favor, iniciá sesión para ver tu perfil.");
        window.location.href = "../../index.html";
        return;
    }

    // Revisa el localStorage
    const listaUsuarios = JSON.parse(localStorage.getItem("usuariosRegistrados")) || [];

    // Revisa el sessionStorage
    const datosUsuario = listaUsuarios.find(u => u.username.toLowerCase() === currentSessionUser.toLowerCase());

    // Captura de elementos del DOM
    const txtNombreCompleto = document.getElementById("perf-nombre-completo");
    const txtUsername = document.getElementById("perf-username");
    const txtEmail = document.getElementById("perf-email");
    const txtDoc = document.getElementById("perf-doc");
    const txtLocalidad = document.getElementById("perf-localidad");
    const btnLogout = document.getElementById("btn-perfil-logout");
    const avatarImg = document.getElementById("perf-avatar-img");
    const inputFileAvatar = document.getElementById("input-file-avatar");
    const btnCambiarFoto = document.getElementById("btn-cambiar-foto");

    // Si el usuario existe, toma la data
 if (datosUsuario) {
    txtNombreCompleto.textContent = `${datosUsuario.nombre} ${datosUsuario.apellido}`;
    txtUsername.textContent = datosUsuario.username;
    txtEmail.textContent = datosUsuario.email;
    txtDoc.textContent = datosUsuario.documento;
    txtLocalidad.textContent = datosUsuario.localidad;

    /*
    =====================================================================
    PREFERENCIAS DE VIAJE
    =====================================================================

    Actualmente Fly Lena todavía no calcula preferencias automáticamente.

    Cuando el módulo de Reservas esté terminado, deberá:

    1) Guardar cada reserva asociada al username del usuario.

    Ejemplo:

    {
        username: "Pablo2490",
        origen: "Buenos Aires",
        destino: "Madrid",
        clase: "Premium",
        pasajeros: 1
    }

    2) Guardar todas las reservas en localStorage.

    Ejemplo:

    localStorage.setItem("reservas", JSON.stringify(listaReservas));

    3) Desde Perfil de Usuario:
       - Leer localStorage["reservas"]
       - Filtrar las reservas del usuario logueado
       - Calcular:
            * Clase más utilizada
            * Cantidad de pasajeros más frecuente
       - Mostrar esos resultados aquí.

    =====================================================================
    */

    txtClase.textContent = "Según historial de vuelos";
    txtEquipaje.textContent = "Según historial de vuelos";

        // Foto de Perfil elegida por el usuario
        if (datosUsuario.avatar) {
            avatarImg.src = datosUsuario.avatar;
        }
    } else if (currentSessionUser === "Administrador") {
        txtNombreCompleto.textContent = "Administrador del Sitio";
        txtUsername.textContent = "adm";
        txtEmail.textContent = "admin@flylena.com";
        txtDoc.textContent = "99999999";
        txtLocalidad.textContent = "Buenos Aires, Argentina";

        // Si el admin guardó foto previamente, buscala en la lista
        const adminData = listaUsuarios.find(u => u.username === "Administrador");
        if (adminData && adminData.avatar) {
            avatarImg.src = adminData.avatar;
        }
    } else {
        txtNombreCompleto.textContent = displayName || currentSessionUser;
        txtUsername.textContent = currentSessionUser;
    }

    // Botón de Cambiar Foto (Abre el explorador de archivos)
    if (btnCambiarFoto && inputFileAvatar) {
        btnCambiarFoto.addEventListener("click", function () {
            inputFileAvatar.click();
        });
    }

    // Procesamiento y Guardado de la Foto de Perfil
    if (inputFileAvatar) {
        inputFileAvatar.addEventListener("change", function (e) {
            const file = e.target.files[0];

            if (file) {
                if (file.size > 1024 * 1024) {
                    alert("La foto es demasiado grande. Elegí una imagen menor a 1MB.");
                    return;
                }

                const reader = new FileReader();

                // TODO lo relacionado al guardado DEBE pasar adentro del onload
                reader.onload = function (event) {
                    const base64Image = event.target.result;

                    // Cambia la vista previa en el HTML de inmediato
                    avatarImg.src = base64Image;

                    // Busca el usuario actual en el array
                    let usuarioAGuardar = listaUsuarios.find(u => u.username.toLowerCase() === currentSessionUser.toLowerCase());

                    // Solución excepcional para la cuenta del administrador
                    if (!usuarioAGuardar && currentSessionUser === "Administrador") {
                        usuarioAGuardar = {
                            username: "Administrador",
                            nombre: "Administrador",
                            apellido: "del Sitio",
                            email: "admin@flylena.com",
                            documento: "99999999",
                            localidad: "Buenos Aires, Argentina"
                        };
                        listaUsuarios.push(usuarioAGuardar);
                    }

                    // Guarda el string de la foto e impacta el localStorage
                    if (usuarioAGuardar) {
                        usuarioAGuardar.avatar = base64Image;
                        localStorage.setItem("usuariosRegistrados", JSON.stringify(listaUsuarios));
                        alert("¡Tu foto de perfil se guardó correctamente!");
                        window.location.reload(); // Recarga para actualizar el navbar instantáneamente
                    } else {
                        alert("Error: No se pudo asociar la foto a tu cuenta.");
                    }
                };

                // Inicia la lectura del archivo
                reader.readAsDataURL(file);
            }
        });
    }

    // Botón de Cierre de Sesión
    if (btnLogout) {
        btnLogout.addEventListener("click", function (e) {
            e.preventDefault();

            sessionStorage.setItem("isLoggedIn", "false");
            sessionStorage.setItem("userName", "");
            sessionStorage.removeItem("displayName");

            alert("Sesión cerrada correctamente. ¡Volvé pronto!");
            window.location.href = "../../index.html";
        });
    }
});