const fetch = require('node-fetch')
const fs = require('fs')

const inFile = process.argv[2]


const getLocation = (id) => {
    return new Promise((resolve, reject) => {
        resolve(
            fetch(`https://pokeapi.co/api/v2/pokemon/${id}/encounters`)
            .then(response => response.json())
            .then((data) => { const loc = data[1].location_area.name;
                    return loc })
            .catch(() => { const loc = 'this pokemon has no known location';
                    return loc}))
        reject()
    })
}

const pokedex = () => {
    return new Promise((resolve, reject) => {
        fs.readFile(inFile, 'utf-8', function (err, data) {
            if (err) {
                reject()
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
                    let result = `${fmtPkm}: no.${data.id} type: `
                    for (let i = 0; i < data.types.length; i++) {
                        const ptype = data.types[i].type.name
                        result += ptype + (i < data.types.length - 1 ? ', ' : '')
                    }
                    getLocation(data.id).then((location) => {
                        result += ', found in: ' + location
                        console.log(result)
                    })
                })
                .catch(() => { return new Error(console.log(`${pokemon} is not a valid pokemon`)) })
        }
    })
        .catch(() => { return new Error(console.log('not enough arguements')) })
}


pokedex(inFile)