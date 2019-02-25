var express = require('express');
var mdAutenticacion = require('../middlewares/autentication');

// Inicializar variables
var app = express();
var Medico = require('../models/medico');

// Routes
app.get('/', (req, res, next) => {
    Medico.find( {}, (err, medicos) => {
        if( err ) {
            return  res.status(200).json({
                ok: true,
                mensaje: 'Error cargando medicos',
                errors: err
            });
        } 
        res.status(200).json({
            ok: true,
            medicos: medicos
        });
    });
});

app.put('/:id', mdAutenticacion.verificationToken, (req, res) => {

    var id = req.params.id
    var body = req.body;

    Medico.findById(id, (err, medico) => {

        if (err) {
            return res.status(500).json({  // 500 Internal Server Error
                ok: false,
                mensaje: 'Error al buscar el medico',
                errors: err
            });
        }

        if (!medico) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El medico con el' + id + 'no existe',
                errors: { mensaje: 'No existe un medico con ese ID' }
            })
        }

        medico.name = body.name;
        medico.usuario = req.usuario;
        medico.hospital = body.hospital;

        medico.save((err, medicoGuardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar medico',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                medico: medicoGuardado,
            });
        });
    });
});

app.post('/', mdAutenticacion.verificationToken, (req, res) => {

    var body = req.body;

    var medico = new Medico({
        name: body.name,
        usuario: req.usuario,
        hospital: body.hospital
    });

    medico.save((err, medicoGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear medico',
                errors: err
            });
        }

        res.status(201).json({   // 201 USUARIO CREADO
            ok: true,
            medico: medicoGuardado,
        });
    });
});

app.delete('/:id', mdAutenticacion.verificationToken, (req, res) => {
    var id = req.params.id;

    Medico.findByIdAndRemove(id, (err, medicoDelete) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error borrar medico',
                errors: err
            });
        }

        if (!medicoDelete) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un medico con ese id',
                errors: { message: 'No existe un medico con ese id' }
            });
        }

        res.status(200).json({
            ok: true,
            Medico: medicoDelete
        });

    });
});

module.exports = app;