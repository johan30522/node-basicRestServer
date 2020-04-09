const express = require('express');
const _ = require('underscore');

const { verificaToken, verificaAdmin_Role } = require('../middlewares/autentication');

let app = express();


let Categoria = require('../models/categoria');

//===============================
//Mostrar categorias todas
//===============================
app.get('/categoria', verificaToken, (req, res) => {

    Categoria.find()
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, categoriaDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    msj: err
                })
            }
            res.json({ ok: true, categorias: categoriaDB });
        })

});

//===============================
//Mostrar categorias por id
//===============================
app.get('/categoria/:id', verificaToken, (req, res) => {
    //Categoria.findById
    let id = req.params.id;
    Categoria.findById(id, 'descripcion')
        .exec((err, categoriaDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    msj: err
                })
            }
            res.json({ ok: true, categorias: categoriaDB });
        })
});

//===============================
//Crear una nueva Categoria
//===============================
app.post('/categoria', [verificaToken, verificaAdmin_Role], (req, res) => {
    //regresa la categoria  creada
    //req.usuario._id
    let body = req.body;
    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id,
    });
    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                msj: err
            })
        }
        return res.json({
            ok: true,
            usuario: categoriaDB
        })
    })
});

//===============================
//Modifica una Categoria
//===============================
app.put('/categoria/:id', [verificaToken, verificaAdmin_Role], (req, res) => {
    //permite actualizar el nomnbre de la categoria
    //req.usuario._id
    let id = req.params.id;
    let body = _.pick(req.body, ['descripcion']);
    Categoria.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, categoriaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                msj: err
            })
        }
        res.json({
            ok: true,
            categoria: categoriaDB
        })
    })
});

//===============================
//Elimina una Categoria
//===============================
app.delete('/categoria/:id', [verificaToken, verificaAdmin_Role], (req, res) => {
    //solo la puede eliminar el administrador
    //debe pedir el token 
    //Categoria.findByIdAndRomove

    let id = req.params.id;

    Categoria.findOneAndRemove(id, (err, categoriaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                msj: err
            })
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                msj: 'Error usuario no encontrado'
            })
        }
        res.json({
            ok: true,
            usuario: categoriaDB
        })
    })

});

module.exports = app;