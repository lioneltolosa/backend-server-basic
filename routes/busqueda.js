var express = require('express');

// Inicializar variables
var app = express();

var Hospital = require('../models/hospital');
var Medico = require('../models/medico');
var Usuario = require('../models/usuario');

// ==============================
// Busqueda por colección
// ==============================

app.get('/coleccion/:tabla/:busqueda' , (req, res) => {

    var busqueda = req.params.busqueda;
    var tabla = req.params.tabla;
    var regex = new RegExp (busqueda, 'i');

    var prosesa;

    switch(tabla) {
        case 'usuarios':
            promesa = buscarUsuarios(busqueda, regex);
            break;
        case 'medicos':
            promesa = buscarMedicos(busqueda, regex);
            break;
        case 'hospitales':
            promesa = buscarHospitales(busqueda, regex);
            break;

        default:
            return res.status(400).json({
                ok: false,
                mensaje: 'Los tipos de busqueda sólo son: usuarios, medicos y hospitales',
                error: { message: 'Tipo de tabla/coleccion no válido' }
            })
    }   

    promesa.then(data => {

        res.status(200).json({
            ok: true,
            [tabla]: data
        });

    })

});


// ==============================
// Busqueda general
// ==============================

// Routes
app.get('/todo/:busqueda', (req, res, next) => {
    
    var busqueda = req.params.busqueda;
    var regex = new RegExp (busqueda, 'i');

    Promise.all([
        buscarHospitales(busqueda, regex),
        buscarMedicos(busqueda, regex),
        buscarUsuarios(busqueda, regex)])
        .then( respuestas => {
            res.status(200).json({
                ok: true,
                hospitales: respuestas[0],
                medicos: respuestas[1],
                usuarios: respuestas[2]
            });
        })
});

function buscarHospitales(busqueda, regex) {

    return new Promise ( (resolve, reject) => {

        Hospital.find({ name: regex })
                .populate('usuario', 'nombre email')
                .exec((err, hospitales) => {

            if( err ) {
                reject('Error al cargar hospitales', err);
            } else {
                resolve(hospitales)
            }
        })
    })
}

function buscarMedicos(busqueda, regex) {

    return new Promise ( (resolve, reject) => {

        Medico.find({ name: regex })
              .populate('usuario', 'nombre email')
              .populate('hospital')
              .exec((err, medicos) => {        
            if( err ) {
                reject('Error al cargar medicos', err);
            } else {
                resolve(medicos)
            }
        })
    })
}

function buscarUsuarios(busqueda, regex) {

    return new Promise ( (resolve, reject) => {

        Usuario.find({}, 'name email')
                .or([ {'name': regex}, {'email': regex} ])
                .exec( (err, usuarios) => {
                 
                    if (err) {
                        reject('Error al cargar usuarios', err);
                    }else {
                        resolve(usuarios);
                    }
                })
    });
}

module.exports = app;