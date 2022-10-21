const { response, json } = require("express");
const bcryptjs = require('bcryptjs');
const Usuario = require('../models/usuario');
const { generarJWT } = require("../helpers/generar-jwt");
const { googleVerify } = require("../helpers/google-verify");


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

const googleSignIn = async(req, res = response) => {
    const { id_token } = req.body;

    try {
        
        const { nombre, img, correo } = await googleVerify( id_token );

        let usuario = await Usuario.findOne({ correo });

        if( !usuario ) {
            // Tengo que crearlo
            const data = {
                nombre,
                correo,
                password: ':)',
                img,
                google: true
            };

            usuario = new Usuario( data );
            await usuario.save();
        }

        // Si el usuario en BD
        if (!usuario.estado) {
            return res.status(401).json({
                msg: 'Hable con el administrador, usuario bloqueado'
            });
        }

        // Generar el JWT
        const token = await generarJWT( usuario.id );
        
        
        res.json({
            usuario,
            token
        });
        
    } catch (error) {
        res.status(400).json({
            ok: false,
            msg: 'El token no se pudo verificar',
            error
        });
    }

}

module.exports = {
    login,
    googleSignIn
}