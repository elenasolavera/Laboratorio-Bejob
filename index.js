var values = {
  nombre: {
    value: "",
    state: "neutral",
    message: "",
  },
  email: {
    value: "",
    state: "neutral",
    message: "",
    rules: [
      "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:.[a-zA-Z0-9-]+)*$",
    ],
    error_messages: ["Email inválido"],
  },
  clave: {
    value: "",
    state: "neutral",
    message: "",
    rules: ["[\\S]{8,}"],
    error_messages: ["Debe tener más de 8 caracteres"],
  },
  confirmclave: {
    value: "",
    state: "neutral",
    message: "",
    rules: [],
    error_messages: [],
  },
};

const states = ["valid", "invalid", "neutral"];

function validation(event) {
  persistData();
  Object.keys(values).forEach((key) => {
    const entry = values[key];
    if (entry.value.length == 0) {
      entry.state = "invalid";
      entry.message = "Rellene este campo";
    } else if (!entry.rules.every((rule) => RegExp(rule).test(entry.value))) {
      entry.state = "invalid";
      entry.message =
        entry.error_messages[
          entry.rules.findIndex((rule) => !RegExp(rule).test(entry.value))
        ];
    } else if (key == "confirmclave" && entry.value !== values.clave.value) {
      entry.state = "invalid";
      entry.message = "Las contraseñas no coinciden";
    } else {
      entry.state = "valid";
      entry.message = "";
    }
  });
  if (
    values.nombre.state == "valid" &&
    values.email.state == "valid" &&
    values.clave.state == "valid" &&
    values.confirmclave.state == "valid"
  ) {
    window.alert("La inscripción ha sido correcta");
  }
  updateUI();
  event.preventDefault();
}

function init() {
  localStorage.removeItem("formdata");
  if (localStorage.getItem("formdata") !== null) {
    values = JSON.parse(localStorage.getItem("formdata"));
    updateUI();
  }
}

function persistData() {
  Object.keys(values).forEach((key) => {
    values[key].value = document.getElementById(key + "_input").value;
  });
  localStorage.setItem("formdata", JSON.stringify(values));
}

function updateUI() {
  Object.keys(values).forEach((key) => {
    const entry = values[key];
    const input = document.getElementById(key + "_input");
    const message = document.getElementById(key + "_message");
    input.value = entry.value;
    input.classList.remove(...states);
    input.classList.add(entry.state);
    message.innerHTML = entry.message;
  });
}
