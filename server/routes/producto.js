const express = require('express');
const _ = require('underscore');

const { verificaToken } = require('../middlewares/autentication');

let app = express();


let Producto = require('../models/producto');



//===============================
//Mostrar productos todos
//===============================
app.get('/productos', verificaToken, (req, res) => {
    //todos los productos
    //populate usuario y categoria
    //odenados
    //paginado
    //obtiene los productos habilitados

    let desde = req.query.desde || 0;
    let limit = req.query.limit;

    desde = Number(desde);
    limit = Number(limit);

    Producto.find({ disponible: true })
        .sort('nombre')
        .skip(desde)
        .limit(limit)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productoDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    msj: err
                })
            }
            Producto.countDocuments({ disponible: true }, (err, count) => {
                res.json({ ok: true, total: count, productos: productoDB });
            })
        })
});

//===============================
//Mostrar productos por id 
//===============================
app.get('/productos/:id', verificaToken, (req, res) => {
    //todos los productos
    //populate usuario y categoria
    //Categoria.findById
    let id = req.params.id;
    Producto.findById(id, 'nombre precioUni descripcion')
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productoDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    msj: err
                })
            }
            res.json({ ok: true, producto: productoDB });
        })
});

//===============================
//buscar productos 
//===============================
app.get('/productos/buscar/:termino', verificaToken, (req, res) => {

    let termino = req.params.termino;
    let regex = new RegExp(termino, 'i'); // se le manda la i para  que sea insencible a mayusculas y minusculas
    Producto.find({ nombre: regex })
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productoDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    msj: err
                })
            }
            res.json({ ok: true, producto: productoDB });
        })
});

//===============================
//crear un producto
//===============================
app.post('/productos', verificaToken, (req, res) => {
    //grabar el usuario
    //grabar la categoria del lsiatdo de categorias
    let body = req.body;
    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
        usuario: req.usuario._id
    });
    producto.save((err, productoDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                msj: err
            })
        }
        //usuarioDB.password = null;
        return res.status(201).json({
            ok: true,
            producto: productoDB
        })
    })
});

//===============================
//Actualizar un producto
//===============================
app.put('/productos/:id', verificaToken, (req, res) => {
    //grabar el usuario
    //grabar la categoria del lsiatdo de categorias

    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'precioUni', 'descripcion', 'disponible', 'categoria']);
    console.log(body);
    Producto.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, productoDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                msj: err
            })
        }
        res.json({
            ok: true,
            producto: productoDB
        })
    })
});

//===============================
//borrar un producto
//===============================
app.delete('/productos/:id', verificaToken, (req, res) => {
    //desactiva el producto en lugar de borrarlo
    let id = req.params.id;

    Producto.findByIdAndUpdate(id, { disponible: false }, { new: true }, (err, productoDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                msj: err
            })
        }
        res.json({
            ok: true,
            usuario: productoDB
        })
    })
});


module.exports = app;