const {Router} = require('express');
const { check } = require('express-validator');

const { validarJWT, validarCampos, esAdminRole } = require('../middlewares');

const { crearCategoria, 
        obtenerCategorias,
        obtenerCategoria,
        actualizarCategoria, 
        borrarCategoria} = require('../controllers/categorias');
const { existeCategoriaPorId } = require('../helpers/db-validators');


const router = Router();
/**
 * {{url}}/api/categorias
 */

// Obtener todas las categorías - Público [LISTO]
router.get('/', obtenerCategorias );


// Obtener categoría por ID - Público [LISTO]
router.get('/:id', [
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom( existeCategoriaPorId ),
    validarCampos
], obtenerCategoria );

// Crear categoría por ID - Privado - Cualquier persona con un token válido
router.post('/', [ 
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
], crearCategoria);


// Actualizar - Privado - Cualquier persona con un token válido
router.put('/:id', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('id').custom( existeCategoriaPorId ),
    validarCampos
], actualizarCategoria);


// Borrar una categoría - Admin
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un id de Mongo válido').isMongoId(),
    validarCampos,
    check('id').custom( existeCategoriaPorId ),
], borrarCategoria);



module.exports = router;