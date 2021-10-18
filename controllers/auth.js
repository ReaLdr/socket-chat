const { response, json } = require("express");
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');

const { generarJWT } = require("../helpers/generar-jwt");
const { googleVerify } = require("../helpers/google-verify");
const { DefaultTransporter } = require("google-auth-library");

const login = async(req, res = response) => {

    const { correo, password } = req.body;

    try {

        // Verificar si el correo existe
        const usuario = await Usuario.findOne({ correo });
        if( !usuario ){
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - correo'
            });
        }

        // Verificar si el usuario está activo en bd
        if( !usuario.estado ){
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - estado: false'
            });
        }

        // Verificar contraseña
        const validPassword = bcryptjs.compareSync( password, usuario.password );
        if( !validPassword ){
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - password'
            });
        }
    
        // Generar JWT
        const token = await generarJWT( usuario.id );
        // creamos promesa manualmente en helper/generar...

        res.json({
            usuario,
            token
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Hable con el admin'
        })
    }


}

const googleSignIn = async(req, res = response) => {
    const { id_token } = req.body;

    try {

        const { nombre, img, correo } = await googleVerify(id_token);

        let usuario = await Usuario.findOne({correo});
        //Usuario es nuestro modelo

        if(!usuario){
            //tengo que crearlo
            const data = {
                nombre,
                correo,
                rol: DefaultTransporter,
                password: ':P',
                img,
                google: true
            };

            usuario = new Usuario (data);
            //crea nuevo usuario
            await usuario.save();
        }

        // Si el usuario en bd 
        if(!usuario.estado){
            return res.status(401),json({
                msg: 'Hable con el administrador, usuario bloqueado'
            });
        }

        // Generar JWT
        const token = await generarJWT( usuario.id );

        console.log('Entra aqui');

        res.json({
            usuario,
            token
        })
        
    } catch (error) {
        console.log(error);
        res.status(400).json({
            ok: false,
            msg: 'El token no se pudo verificar'
        })
    }
}

const renovarToken= async(req, res = response) =>{

    const { usuario } = req;

    // Generar JWT
    const token = await generarJWT( usuario.id );

    res.json({
        usuario, token
    });

}

module.exports = {
    login,
    googleSignIn,
    renovarToken
}