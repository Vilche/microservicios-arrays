const express = require("express");

// Importa el archivo que contiene las rutas para la gestión de las ubicaciones
//const locations = require("../routes/locations");

// Crea una instancia de la aplicación Express
const app = express();

// Agrega las rutas de la gestión de ubicaciones a la aplicación en la ruta /api/v2/countries
//app.use("/api/v2/countries", locations);

// Exporta la aplicación para ser utilizada en otros módulos
module.exports = app;