const { response } = require("express");
const { isValidObjectId } = require("mongoose");

const { Usuario, Categoria, Producto } = require('../models');

const coleccionesPermitidas = [
    'usuarios',
    'categorias',
    'productos',
    'roles'
];


// Búsqueda por usuario
const buscarUsuarios = async (termino = '', res = response) => {

    const esMongoId = isValidObjectId(termino)  //devuelve true si encuentra un id válido

    if (esMongoId) {
        const usuario = await Usuario.findById(termino);
        return res.json({
            results: (usuario) ? [usuario] : []
        });
    }

    const regex = new RegExp(termino, 'i');

    const usuarios = await Usuario.find({
        $or: [{ nombre: regex }, { correo: regex }],
        $and: [{ estado: true }]

    });

    const numberOfResult = usuarios.length;

    res.json({
        rows: numberOfResult,
        results: usuarios
    });


}

const buscarCategorias = async (termino = '', res = response) => {

    const esMongoId = isValidObjectId(termino)  //devuelve true si encuentra un id válido

    if (esMongoId) {
        const categoria = await Categoria.findById(termino);
        return res.json({
            results: (categoria) ? [categoria] : []
        });
    }

    const regex = new RegExp(termino, 'i');

    const categoria = await Categoria.find({nombre: regex, estado: true});

    const numberOfResult = categoria.length;

    res.json({
        rows: numberOfResult,
        results: categoria
    });

}

const buscarProductos = async (termino = '', res = response) => {

    const esMongoId = isValidObjectId(termino)  //devuelve true si encuentra un id válido

    if (esMongoId) {
        const producto = await Producto.findById(termino).populate('categoria', 'nombre');
        return res.json({
            results: (producto) ? [producto] : []
        });
    }

    const regex = new RegExp(termino, 'i');

    const producto = await Producto.find({ nombre: regex, estado: true }).populate('categoria', 'nombre');

    const numberOfResult = producto.length;

    res.json({
        rows: numberOfResult,
        results: producto
    });

}

const buscar = (req, res = response) => {

    const { coleccion, termino } = req.params;

    if (!coleccionesPermitidas.includes(coleccion)) {
        return res.status(400).json({
            msg: `Las colecciones permitidas son ${coleccionesPermitidas}`
        })
    }

    switch (coleccion) {
        case 'usuarios':
            buscarUsuarios(termino, res);
            break;
        case 'categorias':
            buscarCategorias(termino, res);
            break;
        case 'productos':
            buscarProductos(termino, res);
            break;
        case 'roles':

            break;

        default:
            res.status(500).json({
                msg: 'Se me olvidó hacer esta búsqueda'
            });
            break;
    }

}


module.exports = {
    buscar
}