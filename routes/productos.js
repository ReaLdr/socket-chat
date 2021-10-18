const {Router} = require('express');
const { check } = require('express-validator');

const { validarJWT, validarCampos, esAdminRole } = require('../middlewares');

const { crearProducto, 
        obtenerProductos,
        obtenerProducto,
        actualizarProducto, 
        borrarProducto} = require('../controllers/productos');

        const { existeProductoPorId, existeCategoriaPorId } = require('../helpers/db-validators');


const router = Router();
/**
 * {{url}}/api/categorias
 */

// Obtener todos los productos - Público [LISTO]
router.get('/', obtenerProductos );


// Obtener producto por ID - Público [LISTO]
router.get('/:id', [
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom( existeProductoPorId ),
    validarCampos
], obtenerProducto );

// Crear producto por ID - Privado - Cualquier persona con un token válido
router.post('/', [ 
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('categoria', 'No es un id de mongo').isMongoId(),
    check('categoria').custom( existeCategoriaPorId ),
    validarCampos
], crearProducto);


// Actualizar - Privado - Cualquier persona con un token válido
router.put('/:id', [
    validarJWT,
    // check('categoria', 'No es un id de mongo').isMongoId(),
    check('id').custom( existeProductoPorId ),
    validarCampos
], actualizarProducto);


// Borrar un producto - Admin
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un id de Mongo válido').isMongoId(),
    validarCampos,
    check('id').custom( existeProductoPorId ),
], borrarProducto);



module.exports = router;