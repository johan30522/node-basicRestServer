require('./config/config');

const express = require('express');
const mongoose = require('mongoose');

const app = express();

const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

//habilitar la carpeta public
console.log(path.resolve(__dirname, '../public'));
app.use(express.static(path.resolve(__dirname, '../public')));



// parse application/json
app.use(bodyParser.json());

app.use((req, res, next) => {

    // Dominio que tengan acceso (ej. 'http://example.com')
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Metodos de solicitud que deseas permitir
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');

    // Encabecedados que permites (ej. 'X-Requested-With,content-type')
    res.setHeader('Access-Control-Allow-Headers', '*');

    next();
})
app.use(cors())
    //configuracion global de rutas
app.use(require('./routes/index'));


mongoose.connect(process.env.URL_DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
}, (err, res) => {
    if (err) throw err;
    console.log('Base de Datos OnLine!!!');

});

app.listen(process.env.PORT, () => {
    console.log(`escuchando puerto ${process.env.PORT}`);
})