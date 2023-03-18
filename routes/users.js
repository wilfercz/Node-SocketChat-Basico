import {Router} from 'express';

import { check } from 'express-validator';
import {usersGet, usersPost, usersPut, usersDelete, usersPatch} from '../controllers/users.js';

import { esRolValido, existeEmail, existeUsuarioID } from '../helpers/db-validators.js';

import {validarCampos, esAdminRole, tieneRole, validarJWT} from '../middlewares/index.js';

const router = Router();

router.get('/', usersGet);

router.post('/',[
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password debe ser de más de 6 letras').isLength({min: 6}),
    check('correo', 'El correo no es válido').isEmail(),
    check('correo').custom(existeEmail),
    //check('rol', 'No es un rol válido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
    check('rol').custom(esRolValido),
    validarCampos

],usersPost);

router.put('/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeUsuarioID),
    check('rol').custom(esRolValido),
    validarCampos
],usersPut);

router.delete('/:id',[
    validarJWT,
    //esAdminRole,
    tieneRole('ADMIN_ROLE', 'VENTAS_ROLE'),
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeUsuarioID),
    validarCampos
],usersDelete);

router.patch('/', usersPatch);

export {router};