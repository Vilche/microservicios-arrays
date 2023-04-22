const express = require("express"); // importa Express
const router = express.Router(); // crea un nuevo enrutador de Express
const data = require("../../data/data-library"); // importa los datos de data-library

const logger = (message) => console.log(`Author Services: ${message}`);

// define un controlador para la ruta raíz ("/")
router.get("/", (req, res) => {
  const response = {
    // crea una respuesta con información sobre los libros
    service: "books",
    architecture: "microservices",
    length: data.dataLibrary.books.length,
    data: data.dataLibrary.books,
  };
  logger("Get book data"); // registra un mensaje en los registros
  return res.send(response); // devuelve la respuesta al cliente
});

// define un controlador para la ruta "/title/:title"
router.get("/title/:title", (req, res) => {
  // busca los libros que contengan el título buscado
  const titles = data.dataLibrary.books.filter((title) => {
    return title.title.includes(req.params.title);
  });
  // crea una respuesta con información sobre los libros que coinciden con el título buscado
  const response = {
    service: "books",
    architecture: "microservices",
    length: titles.length,
    data: titles,
  };
  return res.send(response); // devuelve la respuesta al cliente
});

router.get("/author/name/:name", async (req, res) => {
  const autor = await fetch(`http://authors:3000/api/v2/authors/author/${req.params.name}`);
  const authorjson = await autor.json();
  const authorId = authorjson.data[0].id;

  const libros = data.dataLibrary.books.filter((libro) => {
    return libro.authorid == authorId;
  });
 
  const response = {
    service: "books",
    architecture: "microservices",
    length: libros.length,
    data: libros,
  };
  return res.send(response);
});


router.get("/author/id/:id", async (req, res) => {
   // Hace una solicitud HTTP a una API externa que devuelve un autor específico utilizando el método fetch() de JavaScript
  const autor = await fetch(`http://authors:3000/api/v2/authors/${req.params.id}`);
  // Convierte la respuesta en formato JSON utilizando el método json() proporcionado por la respuesta de la API externa
  const authorjson = await autor.json();
  // Extrae el ID del autor del objeto JSON devuelto por la API externa
  const authorId = authorjson.data[0].id;

  const books = data.dataLibrary.books.filter((book) => {
    return book.authorid == authorId;
  });
  
  const response = {
    service: "books",
    architecture: "microservices",
    length: books.length,
    data: books,
  };
  return res.send(response);
});

//buscando years especifico
router.get('/years/:year', (req, res) => {
  // Extrae el valor del parámetro "year" de la solicitud utilizando la destructuración de objetos
  const {year} = req.params;
  const books = data.dataLibrary.books.filter(book  => book.year === +year);
 // Filtra los libros para obtener solo aquellos cuyo año de publicación coincide con el valor de "year"
  const response = {
    service: 'books',
    architecture: 'microservices',
    length: books.length,
    data: books,
  };
  return res.json(response); 
});


//Buscando Years mayores
router.get("/yearsMayor/:year", (req, res) => {
  const {year} = req.params;
  const books = data.dataLibrary.books.filter(book => book.year >= +year);

  const response = {
    service: "books",
    architecture: "microservices",
    length: books.length,
    data: books
  };

  return res.json(response);
});


//Buscando years menores

router.get("/yearsMenor/:year", (req, res) => {
  const {year} = req.params;
  const books = data.dataLibrary.books.filter(book => book.year <= +year);  
  const response = {
    service: "books",
    architecture: "microservices",
    length: books.length,
    data: books
  };
  return res.json(response);
});

//Buscar rango de Years

router.get('/years/:minYear/:maxYear', (req, res) => {
  const { minYear, maxYear } = req.params;
  const books = data.dataLibrary.books.filter( book  => book.year >= +minYear && book.year <= +maxYear);
 
  const response = {
    service: 'books',
    architecture: 'microservices',
    length: books.length,
    data: books,
  };
  return res.json(response); 
});

router.get('/distributedCountry/:Country', (req, res) => {
  const {Country} = req.params;
  const books = data.dataLibrary.books.filter( book  => book.distributedCountries.includes(Country));
 
  const response = {
    service: 'books',
    architecture: 'microservices',
    length: books.length,
    data: books,
  };
  return res.json(response); 
});


module.exports = router; // exporta el enrutador de Express para su uso en otras partes de la aplicación

/*
Este código es un ejemplo de cómo crear una API de servicios utilizando Express y un enrutador. El enrutador define dos rutas: una para obtener todos los libros y otra para obtener libros por título. También utiliza una función simple de registro para registrar mensajes en los registros.
*/
