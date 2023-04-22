// Importamos la biblioteca Express
const express = require("express");

// Importamos el archivo data-library.js que contiene la información sobre los países.
const data = require("../../data/data-library");

// Creamos un router de Express
const router = express.Router();

// Creamos una función de registro que imprime mensajes de registro en la consola
const logger = (message) => console.log(`Countries Service: ${message}`);

// Creamos una ruta GET en la raíz del router que devuelve todos los países
router.get("/", (req, res) => {
  // Creamos un objeto de respuesta con información sobre el servicio y los datos de los países
  const response = {
    service: "countries",
    architecture: "microservices",
    length: data.dataLibrary.countries.length,
    data: data.dataLibrary.countries,
  };
  // Registramos un mensaje en la consola
  logger("Get countries data");
  // Enviamos la respuesta al cliente
  return res.send(response);
});

router.get("/Capital/:Capital", async (req, res) => {
  const { Capital } = req.params;
  const filteredCountries = Object.keys(data.dataLibrary.countries).reduce((result, countryCode) => {
    // Object .keys para obtener un arreglo de las claves del objeto
    //reduce() para iterar sobre todas las claves del objeto
    const country = data.dataLibrary.countries[countryCode];
    if (country.capital == Capital) {
      // Si el nombre de la capital del país incluye la capital ingresada en los parámetros de la ruta
      result = country;
      // Agregamos el país al resultado
    }
    return result;
  }, {});


  const author = await fetch(`http://authors:3000/api/v2/authors/author/country/${filteredCountries.name}`);
  const authorjson = await author.json();


  const books = await fetch(`http://books:4000/api/v2/books/distributedCountry/${filteredCountries.name}`);
  const booksjson = await books.json();


  
  
  const response = {
    service: "Countries",
    architecture: "microservices",
    length: Object.keys(filteredCountries).length,
    country: filteredCountries,
    authors: authorjson.data,
    books: booksjson.data

  };

  return res.send(response);
});

router.get("/lenguaje/:lenguaje", async (req, res) => {
  const { lenguaje } = req.params;
  const filteredLenguajes = Object.keys(data.dataLibrary.countries).reduce((result, countryCode) => {
    // Object .keys para obtener un arreglo de las claves del objeto
    //reduce() para iterar sobre todas las claves del objeto
    const country = data.dataLibrary.countries[countryCode];
    if (country.languages.includes(lenguaje)) {
      result.push(country);
    }
    return result;
  }, []);

  const response = {
    service: "Countries",
    architecture: "microservices",
    length: Object.keys(filteredLenguajes).length,
    country: filteredLenguajes,
  };

  res.send(response);
});


// Exportamos el router
module.exports = router;
