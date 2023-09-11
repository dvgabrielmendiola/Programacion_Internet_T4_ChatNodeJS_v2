const socket = io();

let fileURL;

//  Formularios
const formLogin = document.querySelector("#formLogin");
const formContentChat = document.querySelector(".body-chat");
const formShowUsers = document.querySelector("#formShowUsers");
const formChatGrupal = document.querySelector("#formChatGrupal");

//  Textbox's
const txtUserNickName = document.querySelector("#userNickName");
const txtUserMessage = document.querySelector("#userMessage");

//  File - Image
const userFile = document.querySelector("#userFile");

//  Button's
const btnrRegisterUser = document.querySelector("#registerUser");
const btnSendMessage = document.querySelector("#sendMessage");

//  Print
const printUsersActive = document.querySelector("#usersActive");
const printMessages = document.querySelector("#messages");

formContentChat.style.display = "none";
formShowUsers.style.display = "none";
formChatGrupal.style.display = "none";

socket.on("login", () => {
  alert(
    "¡Bienvenido " +
      txtUserNickName.value.trim() +
      "!\nRecuerda, respetar a los demás usuarios."
  );
  formLogin.style.display = "none";
  formContentChat.style.display = "flex";
  formShowUsers.style.display = "block";
  formChatGrupal.style.display = "block";
});

socket.on("userExists", () => {
  alert(
    "El nickname: " +
      txtUserNickName.value.trim() +
      " ya está en uso, intenta con otro."
  );
  txtUserNickName.value = "";
});

socket.on("activeSessions", (users) => {
  printUsersActive.innerHTML = "";
  for (const user in users) {
    printUsersActive.insertAdjacentHTML("beforeend", `<li>${user}</li>`);
  }
});

socket.on("sendMessage", ({ message, user}) => {
  printMessages.insertAdjacentHTML(
    "beforeend",
    `<div class="message frnd_message"><p><span>${user}</span>${message}</p></div>`
  );
  printMessages.scrollTop = printMessages.scrollHeight;
});

txtUserNickName.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    btnrRegisterUser.click();
  }
});

btnrRegisterUser.addEventListener("click", () => {
  if (txtUserNickName.value.trim() != "") {
    let username = txtUserNickName.value.trim();
    socket.emit("register", username);
  }
});

btnSendMessage.addEventListener("click", () => {
    if (txtUserMessage.value.trim() != "") {
        socket.emit("sendMessage", {
          message: txtUserMessage.value.trim(),
        });
    }
  txtUserMessage.value = "";
  printMessages.scrollTop = printMessages.scrollHeight;
});

txtUserMessage.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    if (txtUserMessage.value.trim() != "") {
      socket.emit("sendMessage", {
          message: txtUserMessage.value.trim()
        });
        txtUserMessage.value = "";
    }
      }
  printMessages.scrollTop = printMessages.scrollHeight;
});