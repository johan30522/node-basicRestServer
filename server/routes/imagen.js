const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');

const { verificaTokenURL } = require('../middlewares/autentication');


app.get('/imagen/:tipo/:img', verificaTokenURL, (req, res) => {
    let tipo = req.params.tipo;
    let img = req.params.img;

    let pathImg = path.resolve(__dirname, `../../uploads//${tipo}/${img}`);
    let pathImgNotFound = path.resolve(__dirname, '../assets/image-not-found.png');

    if (fs.existsSync(pathImg)) {
        res.sendFile(pathImg);
    } else {
        res.sendFile(pathImgNotFound);
    }
})


module.exports = app;