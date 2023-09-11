const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const path = require("path");
const PORT = process.env.PORT || 4000;
const list_users = {};

app.use(express.static(path.join(__dirname, "public")));

server.listen(PORT, () => {
  console.log(
    "-Servidor iniciado: " +
      "http://127.0.0.1:" +
      PORT + " -"
  );
});

io.on("connection", (socket) => {
  socket.on("register", (nickname) => {
    if (list_users[nickname]) {
      socket.emit("userExists");
      return;
    } else {
      list_users[nickname] = socket.id;
      socket.nickname = nickname;
      socket.emit("login");
      io.emit("activeSessions", list_users);
    }
  });

  socket.on("disconnect", () => {
    delete list_users[socket.nickname];
    io.emit("activeSessions", list_users);
  });

  socket.on("sendMessage", ({ message}) => {
    io.emit("sendMessage", { message, user: socket.nickname});
  });
});
