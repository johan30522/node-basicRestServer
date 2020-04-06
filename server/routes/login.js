const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');


app.post('/login', function(req, res) {


    let body = req.body;

    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {
        if (err) {
            console.log('debug01');
            return res.status(400).json({
                ok: false,
                err
            })
        }
        if (!usuarioDB) {
            console.log('debug04');
            return res.status(400).json({
                ok: true,
                msj: '(Usuario) o contraseña incorrectos'
            })
        };
        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            console.log('debug03');
            return res.status(400).json({
                ok: false,
                msj: 'Usuario o (contraseña) incorrectos'
            })
        }

        let token = jwt.sign({
            usuario: usuarioDB
        }, process.env.SEED_TOKEN, { expiresIn: process.env.CADUCIDAD_TOKEN });

        console.log('debug04');
        return res.json({
            usuario: usuarioDB,
            token
        })
    })



})




module.exports = app;