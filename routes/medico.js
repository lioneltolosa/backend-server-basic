var express = require('express');
var mdAutenticacion = require('../middlewares/autentication');

// Inicializar variables
var app = express();
var Medico = require('../models/medico');

// Routes
app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde =  Number(desde);

    Medico.find({})
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .populate('hospital')
        .exec( (err, medicos) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando medico',
                        errors: err
                    });
                }
                
                Medico.count({}, (err, conteo) => { 
                res.status(200).json({
                        ok: true,
                        medicos: medicos,
                        total: conteo
                });
            })
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

        medico.nombre = body.nombre;
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
// app.post('/', (req, res) => {

    var body = req.body;

    var medico = new Medico({
        nombre: body.nombre,
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