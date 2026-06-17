// ─── Acordeones: solo uno abierto a la vez ────────────────────────────────────
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
// ─── Validación genérica ──────────────────────────────────────────────────────
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

  if (campo.hasAttribute("required") && valor === "" && campo.type !== "file") {
    marcarError(campo, "Este campo es obligatorio.");
    return false;
  }

  // Número de tarjeta (16 dígitos, puede tener espacios)
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
    const hoy       = new Date();
    const anioCompleto = 2000 + anio;
    const vencimiento  = new Date(anioCompleto, mes - 1, 1);
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
  if (campo.type === "file" && campo.hasAttribute("required")) {
    if (campo.files.length === 0) {
      marcarError(campo, "Debés subir el comprobante de pago.");
      return false;
    }
    const archivo  = campo.files[0];
    const tiposOk  = ["image/jpeg", "image/png", "application/pdf"];
    const maxBytes = 5 * 1024 * 1024; // 5 MB
    if (!tiposOk.includes(archivo.type)) {
      marcarError(campo, "Solo se aceptan JPG, PNG o PDF.");
      return false;
    }
    if (archivo.size > maxBytes) {
      marcarError(campo, "El archivo no debe superar los 5 MB.");
      return false;
    }
  }

  return true;
}
// ─── Formato automático ───────────────────────────────────────────────────────
// Número de tarjeta: agrupa de a 4 dígitos con espacio
document.querySelectorAll("input[placeholder='1234 5678 9012 3456']").forEach(input => {
  input.addEventListener("input", () => {
    let valor = input.value.replace(/\D/g, "").slice(0, 16);
    input.value = valor.replace(/(.{4})/g, "$1 ").trim();
  });
});

// Fecha mm/yy: inserta "/" automáticamente al escribir el mes
document.querySelectorAll("input[placeholder='mm/yy']").forEach(input => {
  input.addEventListener("input", (e) => {
    let valor = input.value.replace(/\D/g, "").slice(0, 4);
    if (valor.length >= 3) {
      valor = valor.slice(0, 2) + "/" + valor.slice(2);
    }
    input.value = valor;
  });
});

// Código de seguridad: solo dígitos, máximo 4
document.querySelectorAll("input[placeholder='123']").forEach(input => {
  input.addEventListener("input", () => {
    input.value = input.value.replace(/\D/g, "").slice(0, 4);
  });
});

// CUIT/CUIL: formato xx-xxxxxxxx-x automático
document.querySelectorAll("input[placeholder='20-00000000-0']").forEach(input => {
  input.addEventListener("input", () => {
    let v = input.value.replace(/\D/g, "").slice(0, 11);
    if (v.length > 10) v = v.slice(0, 2) + "-" + v.slice(2, 10) + "-" + v.slice(10);
    else if (v.length > 2) v = v.slice(0, 2) + "-" + v.slice(2);
    input.value = v;
  });
});

// Nombre en mayúsculas automáticamente
document.querySelectorAll("input[placeholder='Ej: GONZALEZ JUAN'], input[placeholder='Ej. PEREZ JUAN']").forEach(input => {
  input.addEventListener("input", () => {
    const pos = input.selectionStart;
    input.value = input.value.toUpperCase();
    input.setSelectionRange(pos, pos);
  });
});

// Mostrar nombre del archivo subido en el label
const inputFile = document.getElementById("comprobante");
if (inputFile) {
  inputFile.addEventListener("change", () => {
    const label   = document.querySelector("label[for='comprobante']");
    const archivo = inputFile.files[0];
    if (archivo && label) {
      label.childNodes[0].textContent = `📎 ${archivo.name}`;
    }
  });
}

// ─── Validación en tiempo real en todos los campos ────────────────────────────
document.querySelectorAll(".container-pago input, .container-pago select").forEach(campo => {
  campo.addEventListener("blur",  () => validarCampo(campo));
  campo.addEventListener("input", () => limpiarError(campo));
});

// ─── Submit de cada form ──────────────────────────────────────────────────────
document.querySelectorAll(".container-pago form").forEach(form => {
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const campos      = form.querySelectorAll("input, select");
    const resultados  = [...campos].map(c => validarCampo(c));
    const todosValidos = resultados.every(Boolean);

    if (!todosValidos) {
      const primerError = form.querySelector(".campo-error");
      if (primerError) primerError.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    guardarMetodoPago(form);
    window.location.href = form.getAttribute("action");
  });
});

// ─── Guardar método de pago en sessionStorage ─────────────────────────────────
function guardarMetodoPago(form) {
  let metodo = "";
  let datos  = {};

  if (form.classList.contains("container-tarjeta")) {
    metodo = "credito";
    datos  = {
      numeroTarjeta:    form.querySelector("input[placeholder='1234 5678 9012 3456']")?.value || "",
      vencimiento:      form.querySelector("input[placeholder='mm/yy']")?.value               || "",
      titular:          form.querySelector("input[placeholder='Ej: GONZALEZ JUAN']")?.value   || "",
      cuotas:           form.querySelector("select")?.value                                   || "",
    };
  } else if (form.classList.contains("container-debito")) {
    metodo = "debito";
    datos  = {
      numeroTarjeta:    form.querySelector("input[placeholder='1234 5678 9012 3456']")?.value || "",
      vencimiento:      form.querySelector("input[placeholder='mm/yy']")?.value               || "",
      titular:          form.querySelector("input[placeholder='Ej: GONZALEZ JUAN']")?.value   || "",
    };
  } else if (form.classList.contains("container-transferencia")) {
    metodo = "transferencia";
    datos  = {
      banco:    form.querySelector("select")?.value                            || "",
      cbu:      form.querySelector("input[placeholder='0000003100000006000000']")?.value || "",
      cuit:     form.querySelector("input[placeholder='20-00000000-0']")?.value          || "",
      titular:  form.querySelector("input[placeholder='Ej. PEREZ JUAN']")?.value         || "",
    };
  }

  sessionStorage.setItem("metodoPago", JSON.stringify({ metodo, datos }));
}

// ==========================
// DESCUENTOS Y TOTAL DINÁMICO
// ==========================

const resumenVuelo =
    JSON.parse(
        localStorage.getItem("resumenVuelo")
    );

    const selectCuotas = document.querySelector(".campo-cuotas select");

if (selectCuotas && resumenVuelo) {

    const total = resumenVuelo.total;

    const cuota1 = total;

    const cuota3 = Math.round((total * 1.15) / 3);

    const cuota6 = Math.round((total * 1.30) / 6);

    selectCuotas.innerHTML = `
        <option>
            1 cuota (sin interés) de USD ${cuota1}
        </option>

        <option>
            3 cuotas de USD ${cuota3} (15%)
        </option>

        <option>
            6 cuotas de USD ${cuota6} (30%)
        </option>
    `;
}

let descuentoAplicado = 0;

function actualizarResumen() {

    if (!resumenVuelo) return;

    const subtotal =
        resumenVuelo.total;

    const total =
        subtotal - descuentoAplicado;

    document.querySelector(
        "#subtotal-checkout"
    ).textContent =
        `USD ${subtotal}`;

    document.querySelector(
        "#descuento-checkout"
    ).textContent =
        `- USD ${descuentoAplicado}`;

    document.querySelector(
        "#total-checkout"
    ).textContent =
        `USD ${total}`;
}

const btnDescuento =
    document.querySelector(
        "#btn-aplicar-descuento"
    );

if (btnDescuento) {

    btnDescuento.addEventListener(
        "click",
        () => {

            const codigo =
                document
                    .querySelector("#codigo-descuento")
                    .value
                    .trim()
                    .toUpperCase();

            if (codigo === "FLYLENA10") {

                descuentoAplicado =
                    Math.round(
                        resumenVuelo.total * 0.10
                    );

                sessionStorage.setItem(
                    "descuentoAplicado",
                    descuentoAplicado
                );

                alert(
                    "Descuento del 10% aplicado"
                );

            } else {

                descuentoAplicado = 0;

                alert(
                    "Código inválido"
                );
            }

            actualizarResumen();

        }
    );

    actualizarResumen();
}
