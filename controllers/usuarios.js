const { response, request } = require('express');
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');

const usuariosGet = async(req = request, res = response) => {

    //const {q, nombre ="no name", apikey, page = 1, limit} = req.query;

    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true}; //Condición
    //let params = req.query;

    // const usuarios = await Usuario.find( query )
    //     .skip(Number( desde ))
    //     .limit(Number( limite ));


    // const total = await Usuario.countDocuments( query );

    const [total, usuarios] = await Promise.all([
        Usuario.countDocuments( query ),
        Usuario.find( query )
            .skip(Number( desde ))
            .limit(Number( limite ))
    ]);

    res.json({
        total,
        usuarios
    })
}


const usuariosPut = async(req, res) => {

    const id = req.params.id;
    const { _id, password, google, correo, ...resto } = req.body;

    // TODO: validar vs base de datos
    if(password){
         // Encriptar contraseña
        const salt = bcryptjs.genSaltSync()
        resto.password = bcryptjs.hashSync(password, salt);
    }

    const usuario = await Usuario.findByIdAndUpdate( id, resto );

    res.status(500).json(usuario);
}

const usuariosPost = async (req, res) => {

    const { nombre, correo, password, rol } = req.body;

    const usuario = new Usuario({ nombre, correo, password, rol });

    // Encriptar contraseña
    const salt = bcryptjs.genSaltSync()
    usuario.password = bcryptjs.hashSync(password, salt);

    // guardar en bd
    await usuario.save();

    res.json({
        usuario
    })
}


const usuariosDelete = async(req, res = response) => {

    const { id } = req.params;

    // Físicamente lo borramos (Borrado literal de la bd)
    // const usuario = await Usuario.findByIdAndDelete( id );

    const usuario = await Usuario.findByIdAndUpdate(id, {estado:false});
    //const usuarioAutenticado = req.usuario;

    res.json(usuario)
}

const apps = 'rea';

const usuariosPatch = (req, res) => {
    res.json({
        msg: 'patch API - Controlador'
    })
}



module.exports = {
    usuariosGet,
    usuariosPut,
    usuariosPost,
    usuariosDelete,
    usuariosPatch
}
