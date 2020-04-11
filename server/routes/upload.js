const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const Usuario = require('../models/usuario');
const Producto = require('../models/producto');

const fs = require('fs');
const path = require('path');

// default options
app.use(fileUpload());

app.put('/upload/:tipo/:id', function(req, res) {
    let tipoArchivo = req.params.tipo;
    let id = req.params.id;

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            err: 'no se ha seleccionado ningun archivo'
        });
    }
    //valida el id
    if (id === '') {
        return res.status(400).json({
            ok: false,
            err: 'El id de archivo no debe venir en blanco.'
        })
    }
    //valida el tipo de archivo
    let tiposValidos = ['usuario', 'producto'];
    if (tiposValidos.indexOf(tipoArchivo) < 0) {
        return res.status(400).json({
            ok: false,
            err: 'Tipo de archivo no Valido. Archivos validos: ' + tiposValidos.join(', ')
        })
    }

    let fileUpload = req.files.archivo;
    let arrNombreArchivo = fileUpload.name.split('.');

    let nombreExtencion = arrNombreArchivo[arrNombreArchivo.length - 1];
    //valida la extencion
    let extencionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

    //valida si la extencion esta destro de las restringidas
    if (extencionesValidas.indexOf(nombreExtencion) < 0) {
        return res.status(400).json({
            ok: false,
            err: 'Extención de archivo no Valida. Extenciones validas: ' + extencionesValidas.join(', ')
        })
    }
    let nameFile = `${id}_${new Date().getMilliseconds()}.${nombreExtencion}`;
    fileUpload.mv(`uploads/${tipoArchivo}/${nameFile}`, (err) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err: err
            })
        }
        console.log('salvar usuario');
        if (tipoArchivo === 'usuario') {
            //salva el nombre de la imagen en el registro del usuario
            imagenUsuario(id, res, nameFile);
        } else if (tipoArchivo === 'producto') {
            //salva el nombre de la imagen en el registro del producto
            imagenProducto(id, res, nameFile);
        }

    });
})

const imagenUsuario = (id, res, nameFile) => {
    Usuario.findById(id, (err, usuarioDB) => {
        if (err) {
            //borra la imagen que se habia creado
            borrarArchivo(nameFile, 'usuario');
            return res.status(500).json({
                ok: false,
                err: err
            })
        }
        if (!usuarioDB) {
            //borra la imagen que se habia creado
            borrarArchivo(nameFile, 'usuario');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no existe!'
                }
            })
        }
        //Verifica si la imagen existe si es asi la borra
        borrarArchivo(usuarioDB.img, 'usuario');
        // se asigna el nuevo archivo
        usuarioDB.img = nameFile;
        usuarioDB.save((err, usuarioGuardado) => {
            if (err) {
                //borra la imagen que se habia creado
                borrarArchivo(nameFile, 'usuario');
                return res.status(500).json({
                    ok: false,
                    err: err
                })
            }
            res.json({
                ok: true,
                usuario: usuarioGuardado
            })
        })
    })

}
const imagenProducto = (id, res, nameFile) => {
    Producto.findById(id, (err, productoDB) => {
        if (err) {
            //borra la imagen que se habia creado
            borrarArchivo(nameFile, 'producto');
            return res.status(500).json({
                ok: false,
                err: err
            })
        }
        if (!productoDB) {
            //borra la imagen que se habia creado
            borrarArchivo(nameFile, 'producto');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'producto no existe!'
                }
            })
        }
        //Verifica si la imagen existe si es asi la borra
        borrarArchivo(productoDB.img, 'producto');
        // se asigna el nuevo archivo
        productoDB.img = nameFile;
        productoDB.save((err, productoGuardado) => {
            if (err) {
                //borra la imagen que se habia creado
                borrarArchivo(nameFile, 'producto');
                return res.status(500).json({
                    ok: false,
                    err: err
                })
            }
            res.json({
                ok: true,
                producto: productoGuardado
            })
        })
    })
}
const borrarArchivo = (nombreImagen, tipoImagen) => {
    let pathImagen = path.resolve(__dirname, `../../uploads/${tipoImagen}/${nombreImagen}`);
    if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen);
    }
}


module.exports = app;