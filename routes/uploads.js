import {Router} from 'express';
import { check } from 'express-validator';
import { actualizarImg, actualizarImgCloudinary, cargarArchivo, traerImg } from '../controllers/uploads.js';
import { coleccionesPermitidas } from '../helpers/db-validators.js';

import { validarCampos, validarArchivo } from '../middlewares/index.js';

const routerUpload = Router();

routerUpload.post('/',[
    validarArchivo,

    validarCampos
],cargarArchivo);

routerUpload.put('/:coleccion/:id',[
    validarArchivo,
    check('id', 'Debe ser un MongoID').isMongoId(),
    check('coleccion').custom(c => coleccionesPermitidas(c, ['usuarios', 'productos'])),

    validarCampos
],actualizarImgCloudinary);
//],actualizarImg);

routerUpload.get('/:coleccion/:id',[
    check('id', 'Debe ser un MongoID').isMongoId(),
    check('coleccion').custom(c => coleccionesPermitidas(c, ['usuarios', 'productos'])),

    validarCampos
],traerImg);

export {routerUpload};