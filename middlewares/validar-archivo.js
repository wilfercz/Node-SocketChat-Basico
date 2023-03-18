import { request, response } from "express";

const validarArchivo =  (req = request, res = response, next) =>{

    if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
        
        return res.status(400).json({
            msg: 'No hay archivos por subir'
        });
    }

    next();
};

export {validarArchivo};