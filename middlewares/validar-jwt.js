import { request, response } from 'express';
import jwt from 'jsonwebtoken';

import { User } from '../models/usuario.js';

const validarJWT = async(req =request, res = response, next) =>{
    
    const token = req.header('x-token');

    if(!token){
        return res.status(401).json({
            msg: 'No hay token en la petición'
        })
    }

    try {

        const {uid} = jwt.verify(token, process.env.SECRETORPUBLICKEY);

        //leer el usuario que corresponde al uid
        const usuario = await User.findById(uid);

        if(!usuario){
            return res.status(401).json({
                msg: 'Token no válido - usuario no existe en la BD'
            });
        }

        //Verificar si el uid tiene estdo en true
        if(!usuario.estado){
            return res.status(401).json({
                msg: 'Token no válido - usuario con estado: false'
            });
        }

        req.usuario = usuario;

        next();
    } catch (error) {
        res.status(401).json({
            msg: 'Token no válido'
        })
    }

}

export {validarJWT};