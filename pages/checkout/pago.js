//Acordeon
const acordeones = document.querySelectorAll(".container-pago details");
 
acordeones.forEach(detalle => {
    detalle.addEventListener("toggle", () => {
        if (detalle.open) {
            acordeones.forEach(otro => {
                if (otro !== detalle) otro.removeAttribute("open");
            });
        }
    });
});
 
//Validacion
function marcarError(campo, mensaje) {
    campo.classList.add("campo-error");
    let msgEl = campo.parentElement.querySelector(".mensaje-error");
    if (!msgEl) {
        msgEl = document.createElement("span");
        msgEl.className = "mensaje-error";
        campo.parentElement.appendChild(msgEl);
    }
    msgEl.textContent = mensaje;
}
 
function limpiarError(campo) {
    campo.classList.remove("campo-error");
    const msgEl = campo.parentElement.querySelector(".mensaje-error");
    if (msgEl) msgEl.remove();
}
 
function validarCampo(campo) {
    const valor = campo.value.trim();
    limpiarError(campo);
 
    // Obligatorio (solo inputs de texto, no file ni select)
    if (campo.tagName === "INPUT" && campo.type !== "file" && valor === "") {
        marcarError(campo, "Este campo es obligatorio.");
        return false;
    }
 
    // Número de tarjeta (16 dígitos)
    if (campo.placeholder === "1234 5678 9012 3456") {
        const soloDigitos = valor.replace(/\s/g, "");
        if (soloDigitos.length !== 16 || !/^\d+$/.test(soloDigitos)) {
            marcarError(campo, "Ingresá los 16 dígitos de la tarjeta.");
            return false;
        }
    }
 
    // Fecha de vencimiento mm/yy
    if (campo.placeholder === "mm/yy" && valor !== "") {
        if (!/^\d{2}\/\d{2}$/.test(valor)) {
            marcarError(campo, "Formato inválido. Usá mm/aa.");
            return false;
        }
        const [mes, anio] = valor.split("/").map(Number);
        if (mes < 1 || mes > 12) {
            marcarError(campo, "El mes debe ser entre 01 y 12.");
            return false;
        }
        const hoy = new Date();
        const vencimiento = new Date(2000 + anio, mes - 1, 1);
        if (vencimiento < hoy) {
            marcarError(campo, "La tarjeta está vencida.");
            return false;
        }
    }
 
    // Código de seguridad (3 o 4 dígitos)
    if (campo.placeholder === "123" && valor !== "") {
        if (!/^\d{3,4}$/.test(valor)) {
            marcarError(campo, "El código debe tener 3 o 4 dígitos.");
            return false;
        }
    }
 
    // CBU/CVU (22 dígitos)
    if (campo.placeholder === "0000003100000006000000" && valor !== "") {
        const soloDigitos = valor.replace(/\s/g, "");
        if (!/^\d{22}$/.test(soloDigitos)) {
            marcarError(campo, "El CBU/CVU debe tener 22 dígitos.");
            return false;
        }
    }
 
    // CUIT/CUIL (formato xx-xxxxxxxx-x)
    if (campo.placeholder === "20-00000000-0" && valor !== "") {
        if (!/^\d{2}-\d{8}-\d{1}$/.test(valor)) {
            marcarError(campo, "Formato inválido. Usá xx-xxxxxxxx-x.");
            return false;
        }
    }
 
    // Archivo comprobante
    if (campo.type === "file") {
        if (campo.files.length === 0) {
            marcarError(campo, "Debés subir el comprobante de pago.");
            return false;
        }
        const archivo = campo.files[0];
        const tiposOk = ["image/jpeg", "image/png", "application/pdf"];
        if (!tiposOk.includes(archivo.type)) {
            marcarError(campo, "Solo se aceptan JPG, PNG o PDF.");
            return false;
        }
        if (archivo.size > 5 * 1024 * 1024) {
            marcarError(campo, "El archivo no debe superar los 5 MB.");
            return false;
        }
    }
 
    return true;
}
 
// Número de tarjeta: agrupa de a 4 dígitos
document.querySelectorAll("input[placeholder='1234 5678 9012 3456']").forEach(input => {
    input.addEventListener("input", () => {
        let valor = input.value.replace(/\D/g, "").slice(0, 16);
        input.value = valor.replace(/(.{4})/g, "$1 ").trim();
        autoguardarPago();
    });
});
 
// Fecha mm/yy: inserta "/" automáticamente
document.querySelectorAll("input[placeholder='mm/yy']").forEach(input => {
    input.addEventListener("input", () => {
        let valor = input.value.replace(/\D/g, "").slice(0, 4);
        if (valor.length >= 3) valor = valor.slice(0, 2) + "/" + valor.slice(2);
        input.value = valor;
        autoguardarPago();
    });
});
 
// Código de seguridad: solo dígitos, máximo 4
document.querySelectorAll("input[placeholder='123']").forEach(input => {
    input.addEventListener("input", () => {
        input.value = input.value.replace(/\D/g, "").slice(0, 4);
        autoguardarPago();
    });
});
 
// CUIT/CUIL: formato xx-xxxxxxxx-x automático
document.querySelectorAll("input[placeholder='20-00000000-0']").forEach(input => {
    input.addEventListener("input", () => {
        let v = input.value.replace(/\D/g, "").slice(0, 11);
        if (v.length > 10)     v = v.slice(0, 2) + "-" + v.slice(2, 10) + "-" + v.slice(10);
        else if (v.length > 2) v = v.slice(0, 2) + "-" + v.slice(2);
        input.value = v;
        autoguardarPago();
    });
});
 
// CBU: solo dígitos, máximo 22
document.querySelectorAll("input[placeholder='0000003100000006000000']").forEach(input => {
    input.addEventListener("input", () => {
        input.value = input.value.replace(/\D/g, "").slice(0, 22);
        autoguardarPago();
    });
});
 
// Nombre en mayúsculas
document.querySelectorAll(
    "input[placeholder='Ej: GONZALEZ JUAN'], input[placeholder='Ej. PEREZ JUAN']"
).forEach(input => {
    input.addEventListener("input", () => {
        const pos = input.selectionStart;
        input.value = input.value.toUpperCase();
        input.setSelectionRange(pos, pos);
        autoguardarPago();
    });
});
 
// Mostrar nombre del archivo en el label
const inputFile = document.getElementById("comprobante");
if (inputFile) {
    inputFile.addEventListener("change", () => {
        const label = document.querySelector("label[for='comprobante']");
        const archivo = inputFile.files[0];
        if (archivo && label) {
            label.childNodes[0].textContent = `📎 ${archivo.name}`;
        }
    });
}
 
// Autoguardado en selects
document.querySelectorAll(".container-pago select").forEach(sel => {
    sel.addEventListener("change", () => autoguardarPago());
});
 
//Validacion en tiempo real
document.querySelectorAll(".container-pago input, .container-pago select").forEach(campo => {
    campo.addEventListener("blur",  () => validarCampo(campo));
    campo.addEventListener("input", () => limpiarError(campo));
});
 
//Submit de los Forms
document.querySelectorAll(".container-pago form").forEach(form => {
    form.addEventListener("submit", e => {
        e.preventDefault();
 
        const campos = form.querySelectorAll("input, select");
        const resultados = [...campos].map(c => validarCampo(c));
        const todosValidos = resultados.every(Boolean);
 
        if (!todosValidos) {
            const primerError = form.querySelector(".campo-error");
            if (primerError) primerError.scrollIntoView({ behavior: "smooth", block: "center" });
 
            Swal.fire({
                icon: "error",
                title: "Hay campos incompletos",
                html: `<p style="font-size:1.5rem">Revisá los campos marcados en rojo antes de confirmar el pago.</p>`,
                confirmButtonText: "Revisar",
                confirmButtonColor: "#1266d6",
            });
            return;
        }
 
        guardarMetodoPago(form);
        window.location.href = form.getAttribute("action");
    });
});
 
//Guardadado del metodo de pago en sessionStorage
function guardarMetodoPago(form) {
    let metodo = "";
    let datos  = {};
 
    if (form.classList.contains("container-tarjeta")) {
        metodo = "credito";
        datos  = {
            numeroTarjeta: form.querySelector("input[placeholder='1234 5678 9012 3456']")?.value || "",
            vencimiento:   form.querySelector("input[placeholder='mm/yy']")?.value               || "",
            codigo:        form.querySelector("input[placeholder='123']")?.value                 || "",
            titular:       form.querySelector("input[placeholder='Ej: GONZALEZ JUAN']")?.value   || "",
            cuotas:        form.querySelector("select")?.value                                   || "",
        };
    } else if (form.classList.contains("container-debito")) {
        metodo = "debito";
        datos  = {
            numeroTarjeta: form.querySelector("input[placeholder='1234 5678 9012 3456']")?.value || "",
            vencimiento:   form.querySelector("input[placeholder='mm/yy']")?.value               || "",
            codigo:        form.querySelector("input[placeholder='123']")?.value                 || "",
            titular:       form.querySelector("input[placeholder='Ej: GONZALEZ JUAN']")?.value   || "",
        };
    } else if (form.classList.contains("container-transferencia")) {
        metodo = "transferencia";
        datos  = {
            banco:   form.querySelector("select")?.value                                         || "",
            cbu:     form.querySelector("input[placeholder='0000003100000006000000']")?.value    || "",
            cuit:    form.querySelector("input[placeholder='20-00000000-0']")?.value             || "",
            titular: form.querySelector("input[placeholder='Ej. PEREZ JUAN']")?.value            || "",
        };
    }
 
    sessionStorage.setItem("metodoPago", JSON.stringify({ metodo, datos }));
}
 
//Autoguardado en tiempo real
function autoguardarPago() {
    const snapshot = {
        credito: {
            numeroTarjeta: document.querySelector(".container-tarjeta input[placeholder='1234 5678 9012 3456']")?.value || "",
            vencimiento:   document.querySelector(".container-tarjeta input[placeholder='mm/yy']")?.value               || "",
            codigo:        document.querySelector(".container-tarjeta input[placeholder='123']")?.value                 || "",
            titular:       document.querySelector(".container-tarjeta input[placeholder='Ej: GONZALEZ JUAN']")?.value   || "",
            cuotas:        document.querySelector(".container-tarjeta select")?.value                                   || "",
        },
        debito: {
            numeroTarjeta: document.querySelector(".container-debito input[placeholder='1234 5678 9012 3456']")?.value  || "",
            vencimiento:   document.querySelector(".container-debito input[placeholder='mm/yy']")?.value                || "",
            codigo:        document.querySelector(".container-debito input[placeholder='123']")?.value                  || "",
            titular:       document.querySelector(".container-debito input[placeholder='Ej: GONZALEZ JUAN']")?.value    || "",
        },
        transferencia: {
            banco:   document.querySelector(".container-transferencia select")?.value                                    || "",
            cbu:     document.querySelector(".container-transferencia input[placeholder='0000003100000006000000']")?.value || "",
            cuit:    document.querySelector(".container-transferencia input[placeholder='20-00000000-0']")?.value         || "",
            titular: document.querySelector(".container-transferencia input[placeholder='Ej. PEREZ JUAN']")?.value        || "",
        },
    };
 
    sessionStorage.setItem("borradorPago", JSON.stringify(snapshot));
}
 
//Restaurar campos al retroceder hojas
function restaurarDatosPago() {
    const raw = sessionStorage.getItem("borradorPago");
    if (!raw) return;
 
    let snap;
    try { snap = JSON.parse(raw); } catch { return; }
 
    // Crédito
    const cr = snap.credito;
    if (cr) {
        const set = (selector, valor) => {
            const el = document.querySelector(selector);
            if (el && valor) el.value = valor;
        };
        set(".container-tarjeta input[placeholder='1234 5678 9012 3456']", cr.numeroTarjeta);
        set(".container-tarjeta input[placeholder='mm/yy']",               cr.vencimiento);
        set(".container-tarjeta input[placeholder='123']",                 cr.codigo);
        set(".container-tarjeta input[placeholder='Ej: GONZALEZ JUAN']",  cr.titular);
        if (cr.cuotas) {
            const sel = document.querySelector(".container-tarjeta select");
            if (sel) sel.value = cr.cuotas;
        }
    }
 
    // Débito
    const db = snap.debito;
    if (db) {
        const set = (selector, valor) => {
            const el = document.querySelector(selector);
            if (el && valor) el.value = valor;
        };
        set(".container-debito input[placeholder='1234 5678 9012 3456']", db.numeroTarjeta);
        set(".container-debito input[placeholder='mm/yy']",               db.vencimiento);
        set(".container-debito input[placeholder='123']",                 db.codigo);
        set(".container-debito input[placeholder='Ej: GONZALEZ JUAN']",  db.titular);
    }
 
    // Transferencia
    const tr = snap.transferencia;
    if (tr) {
        const set = (selector, valor) => {
            const el = document.querySelector(selector);
            if (el && valor) el.value = valor;
        };
        if (tr.banco) {
            const sel = document.querySelector(".container-transferencia select");
            if (sel) sel.value = tr.banco;
        }
        set(".container-transferencia input[placeholder='0000003100000006000000']", tr.cbu);
        set(".container-transferencia input[placeholder='20-00000000-0']",          tr.cuit);
        set(".container-transferencia input[placeholder='Ej. PEREZ JUAN']",         tr.titular);
    }
 
    // Reabrir el acordeón que tenía datos cargados
    // (prioridad: el método con el que estaba confirmando, si existe)
    const metodoPrevio = JSON.parse(sessionStorage.getItem("metodoPago") || "{}");
    if (metodoPrevio?.metodo) {
        const mapaAcordeon = {
            credito:       ".acordeon-credito",
            debito:        ".acordeon-debito",
            transferencia: ".acordeon-trans",
        };
        const selector = mapaAcordeon[metodoPrevio.metodo];
        if (selector) {
            // Cerrar todos y abrir el que corresponde
            acordeones.forEach(d => d.removeAttribute("open"));
            document.querySelector(selector)?.setAttribute("open", "");
        }
    }
}
 
// ─── Resumen de precios y cuotas dinámicas ────────────────────────────────────
const resumenVuelo = JSON.parse(localStorage.getItem("resumenVuelo"));
 
const selectCuotas = document.querySelector(".container-tarjeta select");
 
if (selectCuotas && resumenVuelo) {
    const total  = resumenVuelo.total;
    const cuota1 = total;
    const cuota3 = Math.round((total * 1.15) / 3);
    const cuota6 = Math.round((total * 1.30) / 6);
 
    selectCuotas.innerHTML = `
        <option>1 cuota (sin interés) de USD ${cuota1.toLocaleString("es-AR")}</option>
        <option>3 cuotas de USD ${cuota3.toLocaleString("es-AR")} (15%)</option>
        <option>6 cuotas de USD ${cuota6.toLocaleString("es-AR")} (30%)</option>
    `;
}
 
let descuentoAplicado = parseInt(sessionStorage.getItem("descuentoAplicado") || "0");
 
function actualizarResumen() {
    if (!resumenVuelo) return;
 
    const subtotal = resumenVuelo.total;
    const total    = subtotal - descuentoAplicado;
 
    document.getElementById("subtotal-checkout").textContent  = `USD ${subtotal.toLocaleString("es-AR")}`;
    document.getElementById("descuento-checkout").textContent = descuentoAplicado > 0
        ? `- USD ${descuentoAplicado.toLocaleString("es-AR")}`
        : "USD 0";
    document.getElementById("total-checkout").innerHTML =
        `<strong>USD ${total.toLocaleString("es-AR")}</strong>`;
}
 
// Código de descuento
const btnDescuento = document.getElementById("btn-aplicar-descuento");
if (btnDescuento) {
    btnDescuento.addEventListener("click", () => {
        const codigo = document.getElementById("codigo-descuento").value.trim().toUpperCase();
 
        if (codigo === "FLYLENA10") {
            descuentoAplicado = Math.round(resumenVuelo.total * 0.10);
            sessionStorage.setItem("descuentoAplicado", descuentoAplicado);
 
            Swal.fire({
                icon: "success",
                title: "Descuento aplicado",
                html: `<p style="font-size:1.5rem">¡Descuento del <b>10%</b> aplicado correctamente!</p>`,
                confirmButtonText: "Continuar",
                confirmButtonColor: "#1266d6",
                timer: 3000,
                timerProgressBar: true,
            });
        } else {
            descuentoAplicado = 0;
            sessionStorage.removeItem("descuentoAplicado");
 
            Swal.fire({
                icon: "error",
                title: "Código inválido",
                html: `<p style="font-size:1.5rem">El código ingresado no es válido o ya expiró.</p>`,
                confirmButtonText: "Reintentar",
                confirmButtonColor: "#1266d6",
            });
        }
 
        actualizarResumen();
    });
}

actualizarResumen();
restaurarDatosPago();
 
// Restaurar cuotas después de restaurar los selects (el innerHTML se sobreescribe arriba)
// Por eso la restauración del select de cuotas va después de generar las opciones dinámicas
const rawSnap = sessionStorage.getItem("borradorPago");
if (rawSnap && selectCuotas) {
    try {
        const snap = JSON.parse(rawSnap);
        if (snap.credito?.cuotas) selectCuotas.value = snap.credito.cuotas;
    } catch { /* no hace nada */ }
}