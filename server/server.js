require('./config/config');

const express = require('express')
const app = express()
const bodyParser = require('body-parser')


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())


app.get('/usuario', function(req, res) {
    res.json('get')
})
app.put('/usuario/:id', function(req, res) {
    let id = req.params.id;
    console.log(id);
    res.json({
        id
    })
})
app.post('/usuario', function(req, res) {
    let body = req.body;
    console.log(body);
    console.log(body.nombre);
    if (body.nombre === undefined) {
        res.status(400).json({
            ok: false,
            msj: 'nombre es necesario'
        });
    } else {
        res.json({ persona: body })
    }

})
app.delete('/usuario/:id', function(req, res) {
    let id = req.params.id;
    console.log(id);
    res.json('delete')
})

app.listen(process.env.PORT, () => {
    console.log(`escuchando puerto ${process.env.PORT}`);
})