const express = require('express');
const app = express();
const Usuario = require('../models/usuario');
const bcrypt = require('bcrypt');
const _ = require('underscore');

app.get('/usuario', function(req, res) {

    Usuario.find({ estado: true })
        .exec((err, usuariosDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    msj: err
                })
            }

            res.json({ ok: true, usuarios: usuariosDB });
        })
})

app.get('/usuario/Paginate', function(req, res) {

    let desde = req.query.desde || 0;
    let limit = req.query.limit;

    desde = Number(desde);
    limit = Number(limit);


    Usuario.find({ estado: true }, 'nombre email role estado')
        .skip(desde)
        .limit(limit)
        .exec((err, usuariosDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    msj: err
                })
            }
            Usuario.countDocuments({ estado: true }, (err, count) => {

                res.json({ ok: true, total: count, usuarios: usuariosDB });

            })

        })
})
app.put('/usuario/:id', function(req, res) {
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'role', 'estado']);



    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                msj: err
            })
        }
        res.json({
            ok: true,
            usuario: usuarioDB
        })
    })

    console.log(id);

})
app.post('/usuario', function(req, res) {
    let body = req.body;
    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });
    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                msj: err
            })
        }
        //usuarioDB.password = null;
        return res.json({
            ok: true,
            usuario: usuarioDB
        })
    })
})
app.delete('/usuario/:id', function(req, res) {
    let id = req.params.id;
    console.log(id);
    Usuario.findOneAndRemove(id, (err, usuarioBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                msj: err
            })
        }
        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                msj: 'Error usuario no encontrado'
            })
        }
        res.json({
            ok: true,
            usuario: usuarioBorrado
        })
    })

})
app.delete('/usuario/deactivate/:id', function(req, res) {
    let id = req.params.id;

    Usuario.findByIdAndUpdate(id, { estado: false }, { new: true }, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                msj: err
            })
        }
        res.json({
            ok: true,
            usuario: usuarioDB
        })
    })

    console.log(id);

})


module.exports = app;