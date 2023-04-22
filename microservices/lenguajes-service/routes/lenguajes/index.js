const express = require("express");
const fs = require('fs');
const csv = require('csv-parser');
const { log } = require("console");

// Creamos un router de Express
const router = express.Router();

// Creamos una función de registro que imprime mensajes de registro en la consola
const logger = (message) => console.log(`Lenguajes Service: ${message}`);

function csvToJson(filePath, callback) {
    // definir la función csvToJson con dos parámetros: filePath y callback
    const results = [];
    // inicializar un arreglo vacío para almacenar los resultados

    fs.createReadStream(filePath)
        // crear un stream de lectura de archivo para el archivo especificado en filePath
        .pipe(csv({ headers: false }))// Indicamos que no hay encabezados en la primera fila 
        // pasar el stream a través del analizador csv-parser
        .on('data', (data) => {

            let values = data[1].replace('"', "").split(";");
            //reemplaza todas las comillas dobles
            //divide la cadena en subcadenas usando ;
            
            let lenguajeValues = [];
            //inicializa un arreglo vacío

            values.forEach(element => {
                lenguajeValues.push(element.trim())
            });
            //iterar por cada elemento
            //agregando los valores recién limpiados a un nuevo arreglo
            results.push({ [data[0]]: lenguajeValues })
        })// Tomamos el primer dato como clave y el segundo como valor
        // cuando se reciba un registro, agregarlo al arreglo de resultados
        .on('end', () => {
            // cuando se complete la lectura del archivo
            callback(null, results);
            // llamar al callback con los resultados como segundo argumento
        })
        .on('error', (err) => {
            // si hay un error en la lectura o el análisis del archivo
            callback(err);
            // llamar al callback con el error como primer argumento
        });
}

router.get("/", (req, res) => {
    csvToJson('data/language-codes.csv', (err, json) => {
        if (err) {
            console.error(err);
        } else {
            res.send(json)
        }
    });

});


router.get("/lenguaje/:lenguaje", async (req, res) => {

    // Se convierte un archivo CSV a JSON utilizando la biblioteca csvToJson
    csvToJson('data/language-codes.csv', (err, json) => {
        if (err) {
            console.error(err);
        } else {

            // Se filtra el objeto JSON para encontrar el objeto correspondiente al lenguaje buscado
            const lenguaje = json.filter(lenguaje => {
                let key = Object.keys(lenguaje);
                let value = lenguaje[key].filter((valueLenguaje) => {
                    return valueLenguaje == req.params.lenguaje
                });

                // Si se encuentra el lenguaje, se devuelve el objeto completo
                if (key[0] == req.params.lenguaje || value[0] == req.params.lenguaje) {
                    return lenguaje
                }
            });

            // Esta función asincrónica recibe el objeto de lenguaje filtrado y busca información adicional en otras APIs
            const Fetchs = async (req, res, lenguaje) => {

                // Se obtiene el código de lenguaje del objeto de lenguaje filtrado
                const lenguajeCode = Object.keys(lenguaje[0]);

                // Se hace una petición a la API de países para obtener información de los países que hablan ese lenguaje
                const countrys = await fetch(`http://countries:5000/api/v2/countries/lenguaje/${lenguajeCode[0]}`);
                const countryJson = await countrys.json();

                // Se inicializan dos matrices vacías para almacenar información de autores y libros
                let authors = [];
                let Books = [];

                // Se itera sobre los países que hablan el lenguaje para obtener información de autores y libros de cada país
                for (let country of countryJson.country) {
                    // Se hace una petición a la API de autores para obtener información de autores de ese país
                    const authores = await fetch(`http://authors:3000/api/v2/authors/author/country/${country.name}`);
                    const authorJson = await authores.json();

                    // Si hay autores en el país, se agregan a la matriz de autores
                    if (authorJson.data.length > 0) {
                        authors.push(authorJson.data);
                    }

                    // Se hace una petición a la API de libros para obtener información de libros de ese país
                    const books = await fetch(`http://books:4000/api/v2/books/distributedCountry/${country.name}`);
                    const bookJson = await books.json();

                    // Si hay libros en el país, se agregan a la matriz de libros
                    if (bookJson.data.length > 0) {
                        Books.push(bookJson.data);
                    }
                }

                // Se construye la respuesta con la información obtenida y se envía al cliente
                const response = {
                    lenguaje: lenguaje,
                    contrys: countryJson.country,
                    authores: authors,
                    books: Books
                }
                res.send(response);
            }

            // Se llama a la función Fetchs para procesar la información del lenguaje y enviar la respuesta al cliente
            Fetchs(req, res, lenguaje);

        }
    });
});


// Exportamos el router
module.exports = router;