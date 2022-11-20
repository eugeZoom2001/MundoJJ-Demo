module.exports = (io) => {
  users = [];

  io.on("connection", (socket) => {
    //Mensaje global
    // console.log("connection");

    socket.on("enviar mensaje", ({ msg, from }) => {
      //console.log("mensaje global", msg, from);
      io.sockets.emit("nuevo mensaje", {
        msg,
        from,
      });
    });

    socket.on("mensaje_privado", (data) => {
      //console.log("data", data);
      const elem = users.find((e) => e.nickname === data.to.trim());
      if (elem) {
        io.to(elem.socketId).emit("private-msg", data);
      }
    });

    socket.on("get_users", (nickname, callback) => {
      // //console.log("get-users");
      const _users = users.filter((user) => user.nickname !== nickname);
      callback(_users);
    });

    socket.on("nuevo_usuario", (nickname, callback) => {
      const isUser = users.some((e) => e.nickname === nickname);
      if (!isUser) {
        callback(true, users);
        users.push({ nickname, socketId: socket.id });
        // console.log("new user", users);
        socket.broadcast.emit("nuevo_usuario", {
          nickname,
          socketId: socket.id,
        });
      } else {
        callback(false, users);
      }
    });

    socket.on("disconnect", () => {
      const userOut = users.find((e) => e.socketId === socket.id);
      if (userOut) {
        let nickOut = userOut.nickname;
        eliminarUser(socket.id);
        socket.broadcast.emit("user_logout", nickOut);
        //console.log("elimino user", users);
      }
    });

    socket.on("logout", (nick) => {
      eliminarUser(socket.id);
      socket.broadcast.emit("user_logout", nick);
    });
  });

  const eliminarUser = (idSocket) => {
    newUsers = users.filter((u) => u.socketId !== idSocket);
    users = newUsers;
  };
};
