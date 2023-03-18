import {Router} from 'express';
import { check } from 'express-validator';
import { actualizarProduct, crearProduct, obtenerProduct, obtenerProducts, borrarProduct} from '../controllers/productos.js';
import { existeCatg, existeProducto } from '../helpers/db-validators.js';

import { validarJWT, validarCampos, esAdminRole} from '../middlewares/index.js';

const routerProduct = Router();

routerProduct.get('/', obtenerProducts);

routerProduct.get('/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeProducto),

    validarCampos
],obtenerProduct);

routerProduct.post('/', [
    validarJWT,
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    check('categoria','No es un id de Mongo').isMongoId(),
    check('categoria').custom(existeCatg),

    validarCampos
],crearProduct);

routerProduct.put('/:id', [
    validarJWT,
    check('id').custom(existeProducto),

    validarCampos
],actualizarProduct);

routerProduct.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un ID válido').isMongoId(),
    validarCampos,
    check('id').custom(existeProducto),
    validarCampos
],borrarProduct);

export {routerProduct};