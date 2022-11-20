//require('./database')
require("dotenv").config();
require("express-async-errors");
const connectDB = require("./db/connect");
const helmet = require("helmet");
const xss = require("xss-clean");
var express = require("express");
var cors = require("cors");
var app = express();
app.use(cors());
app.use(express.static("./public"));
app.use(express.json()); //Used to parse JSON bodies
app.use(express.urlencoded({ extended: true })); //Parse URL-encoded bodies
app.use(helmet());
app.use(xss());
appSockets = express();
//appSockets.use(cors2());
const authenticateUser = require("./middleware/authentication");

let routeUser = require("./routes/user");

app.use("/api/v1/user", routeUser);

app.get("/", (req, res) => {
  res.send("hola , soy Server 8800!");
});

const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

//Middleware

app.use(notFoundMiddleware); // si encuentra la ruta , aca no va a entrar
app.use(errorHandlerMiddleware);

//******************************************** */
const port = process.env.PORT || 8800;

//***************** Sockets ************************** */

// const serverSockets = require("http").Server(appSockets, {
//   cors: {
//     origin: "http://localhost:3000",
//   },
// });
const serverSockets = require("http").Server(appSockets);
const socketio = require("socket.io")(serverSockets);
appSockets.set("port", process.env.SOCKET_PORT || 5000);

//Ejecutamos la función de sockets.js
require("./sockets")(socketio);

const startSockets = () => {
  serverSockets.listen(appSockets.get("port"), () => {
    console.log("Servidor sockets en el puerto ", appSockets.get("port"));
  });
};

const startServer = async () => {
  try {
    // connectDB
    await connectDB(process.env.DB_URI_LOCAL);
    console.log(`BBDD conectada ${process.env.DB_URI_LOCAL}`);

    app.listen(port, () => console.log(`Server escuchando puerto ${port}...`));
  } catch (error) {
    console.log("no hay conexion a datos");
  }
};

//startServer();

startSockets();
