

const {Router} = require('express');
const { check } = require('express-validator');

// const { validarCampos } = require('../middlewares/validar-campos');
// const { validarJWT } = require('../middlewares/validar-jwt');
// const { esAdminRole, tieneRole } = require('../middlewares/validar-roles');

const { validarCampos, validarJWT, esAdminRole, tieneRole } = require('../middlewares')

const { esRolValido, emailExiste, existeUsuarioPorId } = require('../helpers/db-validators')

const { usuariosGet,
        usuariosPut,
        usuariosPost,
        usuariosDelete,
        usuariosPatch } = require('../controllers/usuarios');


const router = Router();



router.get('/', usuariosGet)

router.put('/:id', [
  check('id', 'NO es un ID válido').isMongoId(),
  check('id').custom( existeUsuarioPorId ),
  check('rol').custom( esRolValido ),
  validarCampos
], usuariosPut)

router.post('/', [
  check('nombre', 'El nombre es obligatorio').not().isEmpty(),
  check('password', 'El password es obligatorio y con más de 6 letras').isLength({min: 6}),
  check('correo').custom(emailExiste),
  //check('correo', 'El correo no es válido').isEmail(),
  // check('rol', 'No es un rol válido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
  check('rol').custom( esRolValido ),
  validarCampos
], usuariosPost)

  router.delete('/:id', [
    validarJWT,
    // esAdminRole,
    tieneRole('ADMIN_ROLE', 'VENTAS_ROLE'),
    check('id', 'NO es un ID válido').isMongoId(),
    check('id').custom( existeUsuarioPorId ),
    validarCampos
  ], usuariosDelete)
  
  router.patch('/', usuariosPatch)


module.exports = router;