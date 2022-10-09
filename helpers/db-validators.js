const Role = require('../models/role');
const Usuario = require('../models/usuario');

const esRoleValido =  async(rol = '') => {
    const existeRol = await Role.findOne({ rol });
    if ( !existeRol ) {
        throw new Error(`El rol ${ rol } no está registrado en la BD`);
    }
}

const emailExiste = async( correo = '' ) => {
    const existeEmail = await Usuario.findOne({ correo });
    if ( existeEmail ) {
        throw new Error(`El correo ${ correo }, ya está registrado`);
        
        // return res.status(400).json({
        //     msg: 'Ese correo ya está registrado'
        // })
    }
}

const existeUsuarioPorId = async( id ) => {
    const existeUsuario = await Usuario.findById( id );
    if ( !existeUsuario ) {
        throw new Error(`El Id ${ id }, no existe en la base de datos`);
        
        // return res.status(400).json({
        //     msg: 'Ese correo ya está registrado'
        // })
    }
}

module.exports = {
    esRoleValido,
    emailExiste,
    existeUsuarioPorId
}