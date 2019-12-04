const fs = require('fs');
const path = require('path');
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


//Funcion para leer archivos
const fileMdLinks = (path => {
    let pro = new Promise((resolve, reject) => {
        //leo el archivo md de manera asincrona
        fs.readFile(path, 'utf8', (err, data) => {

            if (err) return reject(err);
            return resolve(data);

        })


    });
    return pro;

})

//Funcion para extraer arreglo con links y href ,text , file
const allLinks = (() => {
    let printsLinks = new Promise((resolve, reject) => {
        fileMdLinks(process.argv[2])
            .then(datos => {
                let renderer = new marked.Renderer();
                let links = [];
                renderer.link = function(href, title, text) {
                    links.push({
                        href: href,
                        title: title,
                        text: text,
                        file: process.argv[2],
                    });
                };

                marked(datos, { renderer: renderer });

                console.log(links)

                return resolve(links)

            })

        .catch(err => {
            reject(console.log(err));

        })

    })
    return printsLinks;
})

allLinks()


let validate = () => {
    //let promiseFetch = new Promise((resolve ,reject)=>{
    allLinks().then((links) => {
        links.map(e => {
            return fetch(e.href).then(res => {
                // v.status=res.statusText;
                if (res.ok) {
                    console.log(e.href + res.status);
                    console.log(res.statusText);
                    // v.statusCode = res.status;
                } else {
                    console.log(e.href + res.status)
                    console.log(res.statusText);
                }
            }).catch((err) => {
                console.log(err.statusText);
                // v.status = err
            });

        });

    })

}
validate();