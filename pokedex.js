const fetch = require('node-fetch')
const fs = require('fs')

// read inFile and loop through each line

const inFile = process.argv[2]

const pokedex = () => {
    return new Promise((resolve, reject) => {
        fs.readFile(inFile, 'utf-8', function (err, data) {
            if (err) {
                reject('ERROR')
            }
            else {
                resolve(data.split('\n'))
            }
        })
    }).then((data) => {
        for (let i = 0; i < data.length; i++) {
            const pokemon = data[i]
            const fmtPkm = data[i].charAt(0).toUpperCase() + data[i].slice(1)
            fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`)
                .then(response => response.json())
                .then((data) => {
                    let result = `${fmtPkm}: `
                    for (let i = 0; i < data.types.length; i++) {
                        const ptype = data.types[i].type.name
                        result += ptype + (i < data.types.length - 1 ? ', ' : '')
                    }
                    console.log(result)
                })
        }
    });
}

pokedex(inFile)