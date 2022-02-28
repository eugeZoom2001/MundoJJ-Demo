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

const authenticateUser = require("./middleware/authentication");

let routeUser = require("./routes/user");
let routerAutos = require("./routes/autos");
let routerStock = require("./routes/stock");
let routerProveedores = require("./routes/proveedores");

app.use("/api/v1/user", routeUser);
app.use("/api/v1/autos", authenticateUser, routerAutos);
app.use("/api/v1/stock", authenticateUser, routerStock);
app.use("/api/v1/proveedores", authenticateUser, routerProveedores);

const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

//Middleware

app.use(notFoundMiddleware); // si encuentra la ruta , aca no va a entrar
app.use(errorHandlerMiddleware);

//******************************************** */
const port = process.env.PORT || 3000;

const start = async () => {
  try {
    // connectDB
    await connectDB(process.env.DB_URI_LOCAL);
    console.log(`BBDD conectada ${process.env.DB_URI_LOCAL}`);

    app.listen(port, () => console.log(`Server escuchando puerto ${port}...`));
  } catch (error) {
    console.log("no hay conexion a datos");
  }
};

start();
