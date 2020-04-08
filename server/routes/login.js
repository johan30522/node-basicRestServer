const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

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

//Configuraciones de Google
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    console.log(payload.name);
    console.log(payload.email);
    console.log(payload.picture);
    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }

}


app.post('/google', async(req, res) => {

    let token = req.body.idtoken;
    console.log('autentica google');
    console.log(token);

    let googleUser = await verify(token)
        .catch(e => {
            return res.status(403).json({
                ok: false,
                detalle: e
            });
        });

    Usuario.findOne({ email: googleUser.email }, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        // verifica si el usuario existe
        if (usuarioDB) {
            //verifica si el usuario esta definido como de google
            if (usuarioDB.google === false) {
                return res.status(400).json({
                    ok: true,
                    msj: 'debe de usar su autenticacion normal '
                })
            } else {
                //si es de google genera un token
                console.log('usuario existente google');
                let token = jwt.sign({
                    usuario: usuarioDB
                }, process.env.SEED_TOKEN, { expiresIn: process.env.CADUCIDAD_TOKEN });

                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                })
            };
        } else {
            //si el usuario no existe en la base de datos
            console.log('usuario nuevo google');
            let usuario = new Usuario();
            usuario.nombre = googleUser.nombre;
            usuario.email = googleUser.email;
            usuario.img = googleUser.img;
            usuario.google = true;
            usuario.password = ":)";

            usuario.save((err, usuarioDB) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    })
                }
                let token = jwt.sign({
                    usuario: usuarioDB
                }, process.env.SEED_TOKEN, { expiresIn: process.env.CADUCIDAD_TOKEN });

                return res.json({
                    usuario: usuarioDB,
                    token
                })
            });
        }
    })
})

module.exports = app;