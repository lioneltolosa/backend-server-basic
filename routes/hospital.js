var express = require('express');
var mdAutenticacion = require('../middlewares/autentication');

// Inicializar variables
var app = express();
var Hospital = require('../models/hospital');

// Routes
app.get('/', (req, res, next) => {
    Hospital.find( {}, (err, hospitals) => {
        if( err ) {
            return  res.status(200).json({
                ok: true,
                mensaje: 'Error cargando hospitals',
                errors: err
            });
        } 
        res.status(200).json({
            ok: true,
            hospitals: hospitals
        });
    });
});

app.put('/:id', mdAutenticacion.verificationToken, (req, res) => {

    var id = req.params.id
    var body = req.body;

    Hospital.findById(id, (err, hospital) => {

        if (err) {
            return res.status(500).json({  // 500 Internal Server Error
                ok: false,
                mensaje: 'Error al buscar el hospital',
                errors: err
            });
        }

        if (!hospital) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El hospital con el' + id + 'no existe',
                errors: { mensaje: 'No existe un hospital con ese ID' }
            })
        }

        hospital.name = body.name;

        hospital.save((err, hospitalGuardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar hospital',
                    errors: err
                });
            }

            hospitalGuardado.password = ':)';

            res.status(200).json({
                ok: true,
                hospital: hospitalGuardado,
            });
        });
    });
});

app.post('/', mdAutenticacion.verificationToken, (req, res) => {

    var body = req.body;

    var hospital = new Hospital({
        name: body.name,
        usuario: body.id
    });

    hospital.save((err, hospitalGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear hospital',
                errors: err
            });
        }

        res.status(201).json({   // 201 USUARIO CREADO
            ok: true,
            hospital: hospitalGuardado,
        });
    });
});

app.delete('/:id', mdAutenticacion.verificationToken, (req, res) => {
    var id = req.params.id;

    Hospital.findByIdAndRemove(id, (err, hospitalDelete) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error borrar hospital',
                errors: err
            });
        }

        if (!hospitalDelete) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un hospital con ese id',
                errors: { message: 'No existe un hospital con ese id' }
            });
        }

        res.status(200).json({
            ok: true,
            Hospital: hospitalDelete
        });

    });
});

module.exports = app;