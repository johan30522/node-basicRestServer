const jwt = require('jsonwebtoken');

//=============================
//VERIFICAR TOKEN
//=============================


let verificaToken = (req, res, next) => {
    let token = req.get('token');

    jwt.verify(token, process.env.SEED_TOKEN, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no valido',
                    detalle: err
                }
            });
        }
        req.usuario = decoded.usuario;
        next();
    })

}
let verificaAdmin_Role = (req, res, next) => {

    let usuario = req.usuario;
    if (usuario.role != 'ADMIN_ROLE') {
        return res.status(401).json({
            ok: false,
            err: {
                message: 'Rol no autorizado'
            }
        });
    }
    next();
}

module.exports = {
    verificaToken,
    verificaAdmin_Role
};