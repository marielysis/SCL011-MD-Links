const fs = require('fs');
const marked = require('marked');
const FileHound = require('filehound');
const fetch = require('node-fetch');

//FILEHOUND para encontrar archivos MD dentro un directorio
const findMdFiles = (path => {
    return new Promise((resolve, reject) => {
        FileHound.create()
            .paths(path)
            .ext('md')
            .find()
            .then(files => {
                if (files.length != 0) {
                    resolve(files)
                }
                reject(new Error("No se encontraron archivos .md dentro de " + path))
            })
            .catch(err => {
                reject(new Error("Esta ruta no existe, inténtalo con otra"))
            })
    })
})



//leer archivo.md
const readMd = (path => {
    return new Promise((resolve, reject) => {
        fs.readFile(path, 'utf8', (err, data) => {
            if (err) {
                reject(new Error("¡Ups! No se encontro el archivo " + path))
            }
            resolve(data)
        })
    })
})


//obtener links de un archivo .md
const searchLinks = (path => {
    return new Promise((resolve, reject) => {
        readMd(path).then(res => {
                let links = [];
                const renderer = new marked.Renderer();
                renderer.link = function(href, title, text) {

                    if (!href.startsWith("mailto:")) {
                        links.push({
                            // Url encontrada.
                            href: href,
                            // Texto que aparece acompañando al link.
                            text: text,
                            // Ruta del archivo donde se encontró el link.
                            file: path
                        })
                    }
                }
                marked(res, { renderer: renderer });
                resolve(links)
            })
            .catch(err => {
                reject(err)
            })
    })
})