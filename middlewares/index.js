const  validarCampos = require('../middlewares/validar-campos');
const  validaJWT = require('../middlewares/validar-jwt');
const  validaRoles  = require('../middlewares/valida-roles');

module.exports = {
    ...validarCampos,
    ...validaJWT,
    ...validaRoles
}