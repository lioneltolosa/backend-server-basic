var jwt = require('jsonwebtoken');

var SEED = require('../config/config').SEED;

// CHECK TOKEN
// app.use('/', (req, res, next) => {
//     var token = req.query.err

//     jwt.verify(token, SEED, (err, decode) => {
//         if (err) {
//             return res.status(401).json({  // 500 Internal Server Error
//                 ok: false,
//                 mensaje: 'Token no valido',
//                 errors: err
//             });
//         }
//         next();
//     });
// });

exports.verificationToken = function(req, res, next) {
    var token = req.query.token

    jwt.verify(token, SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({  // 500 Internal Server Error
                ok: false,
                mensaje: 'Token no valido',
                errors: err
            });
        }

        req.usuario = decoded.usuario;

        next();
        // res.status(200).json({
        //     ok: false,
        //     decode: decode
        // });

    });
}