const { response } = require("express");
const bcryptjs = require('bcryptjs');
const Usuario = require('../models/usuario');
const { generarJWT } = require("../helpers/generar-jwt");


const login = async(req, res = response) => {
    const { correo, password } = req.body;
    
    try {
        
        // Verificar si email existe
        const usuario = await Usuario.findOne({ correo });

        if ( !usuario ) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - correo'
            });
        }

        if ( !usuario.estado ) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - estado:false '
            });
        }

        // Verificar si el usuario está activo
        const validPassword = bcryptjs.compareSync( password, usuario.password );
        if (!validPassword) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - password '
            });
        }
        // Verificar el password

        // Generar el JWT
        const token = await generarJWT( usuario.id );
        
        
        res.json({
            usuario,
            token
        });

    } catch (error) {
        
        console.log(error);
        
        return res.status(500).json({
            msg: 'Error, contacte al administrador'
        });
    }
    
}

module.exports = {
    login
}