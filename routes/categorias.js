import {Router} from 'express';
import { check } from 'express-validator';

import { obtenerCatgs, obtenerCatg, crearCatg, actualizarCatg, borrarCatg } from '../controllers/categorias.js';
import { existeCatg } from '../helpers/db-validators.js';
import { validarJWT, validarCampos, esAdminRole} from '../middlewares/index.js';

const routerCatg = Router();

routerCatg.get('/',obtenerCatgs);

routerCatg.get('/:id',[
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeCatg),

    validarCampos
],obtenerCatg);

routerCatg.post('/',[
    validarJWT,
    check('nombre','El nombre es obligatorio').not().isEmpty(),

    validarCampos
],crearCatg);

routerCatg.put('/:id',[
    validarJWT,
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    check('id').custom(existeCatg),

    validarCampos
],actualizarCatg);

routerCatg.delete('/:id',[
    validarJWT,
    esAdminRole,
    check('id', 'No es un ID válido').isMongoId(),
    validarCampos,
    check('id').custom(existeCatg),
    validarCampos
],borrarCatg);

export {routerCatg};