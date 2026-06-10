const formRegistro = document.getElementById("form-registro");

formRegistro.addEventListener("submit", function(e) {
    e.preventDefault(); 

    //Storage del Usuario Nuevo recien creado
    const username = document.getElementById("username").value.trim();
    const nombre1 = document.getElementById("nombre1").value.trim();
    const apellido = document.getElementById("apellido").value.trim();
    const numDoc = document.getElementById("num_doc").value.trim();
    const fechaNac = document.getElementById("fecha_nac").value;
    const email = document.getElementById("email").value.trim().toLowerCase();
    const password = document.getElementById("password-reg").value;
    const localidad = document.getElementById("localidad").value.trim();

    // Validación del formato del Nombre de Usuario
    const regexUsername = /^[a-zA-Z0-9_ñÑ]+$/;
    if (!regexUsername.test(username)) {
        alert("El Nombre de Usuario no puede contener espacios ni caracteres especiales (solo letras, números o guion bajo).");
        return;
    }

    if (username.length < 4) {
        alert("El Nombre de Usuario debe tener al menos 4 caracteres.");
        return;
    }

    const regexLetras = /^[a-zA-Z\sñáéíóúÁÉÍÓÚ]+$/;
    if (!regexLetras.test(nombre1) || !regexLetras.test(apellido)) {
        alert("El nombre y el apellido solo deben contener letras.");
        return;
    }

    const fechaSeleccionada = new Date(fechaNac);
    const hoy = new Date();
    const anioMinimo = new Date("1900-01-01");
    if (fechaSeleccionada > hoy || fechaSeleccionada < anioMinimo) {
        alert("Por favor, ingrese una fecha de nacimiento válida.");
        return;
    }

    if (password.length < 4) {
        alert("La contraseña debe tener un mínimo de 4 caracteres por seguridad.");
        return;
    }

    //Creación del localStorage
    let listaUsuarios = JSON.parse(localStorage.getItem("usuariosRegistrados")) || [];

    //Validacion del Nombre de Usuario (Y controla que no haya duplicados)
    const usuarioExistente = listaUsuarios.some(u => u.username.toLowerCase() === username.toLowerCase());
    if (usuarioExistente) {
        alert(`Lo sentimos, el nombre de usuario "${username}" ya está en uso. Elegí otro.`);
        return;
    }

    const emailExistente = listaUsuarios.some(u => u.email === email);
    if (emailExistente) {
        alert("Este correo electrónico ya se encuentra registrado.");
        return;
    }

    //Creacion del Usuario Nuevo (y lo guarda en localStorage)
    const nuevoUsuario = {
        username: username,
        nombre: nombre1,
        apellido: apellido,
        documento: numDoc,
        email: email,
        password: password,
        localidad: localidad
    };

    //Agrega el Usuario Nuevo al array de usuarios, actualiza el localStorage y lo manda a la hoja del Login
    listaUsuarios.push(nuevoUsuario);
    localStorage.setItem("usuariosRegistrados", JSON.stringify(listaUsuarios));

    alert("¡Cuenta creada con éxito! Ahora podés iniciar sesión.");
    
    window.location.href = "login.html"; 
});