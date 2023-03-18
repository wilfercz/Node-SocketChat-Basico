import path from 'path';
import * as url from 'url';
import fs from 'fs';

import dotenv from 'dotenv';
import {v2 as cloudinary} from 'cloudinary';

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
});

import { request, response } from "express";

import { subirArchivo } from "../helpers/subir-archivo.js";
import { User, Producto } from "../models/index.js";

const cargarArchivo = async(req = request, res = response)=>{

    try {
        //Archivos
        //const nombreTemp = await subirArchivo(req.files, ['txt','md'], 'textos');
        const nombreTemp = await subirArchivo(req.files, undefined, 'imgs');

        res.json({
            archivo: nombreTemp
        });
        
    } catch (error) {
        res.status(400).json({
            error
        });
    }
};

const actualizarImg = async(req = request, res = response) =>{

    const {id, coleccion} = req.params;

    let modelo;

    switch(coleccion){
        case 'usuarios':

            modelo = await User.findById(id);
            if(!modelo){
                return res.status(400).json({msg: `No existe un usuario con el id ${id}`});
            }

        break;

        case 'productos':

            modelo = await Producto.findById(id);
            if(!modelo){
                return res.status(400).json({msg: `No existe un producto con el id ${id}`});
            }

        break;

        default:
            return res.status(500).json({msg: 'Se me olvidó validar esto'});

    }

    //Limpiar imágenes previas
    const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
    try {

        if(modelo.img){
            // Hay que borrar la imagen del servidor
            const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img);
            if(fs.existsSync(pathImagen)){
                fs.unlinkSync(pathImagen);
            }
        }

    } catch (err) {
        
    }

    const nombre = await subirArchivo(req.files, undefined, coleccion);
    modelo.img = nombre;

    await modelo.save();

    res.json({
        modelo
    });

};

const traerImg = async(req = request, res = response) =>{

    const {id, coleccion} = req.params;

    const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
    const pathImgAux = path.join( __dirname, '../assets/no-image.jpg');
    
    let modelo;

    switch(coleccion){
        case 'usuarios':

            modelo = await User.findById(id);
            if(!modelo){
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${id}`
                });   
            }

        break;

        case 'productos':

            modelo = await Producto.findById(id);
            if(!modelo){
                return res.status(400).json({
                    msg: `No existe un producto con el id ${id}`
                });
            }

        break;

        default:
            return res.status(500).json({msg: 'Se me olvidó validar esto'});

    }

    try {

        if(modelo.img){
            // Hay que borrar la imagen del servidor
            const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img);
            if(fs.existsSync(pathImagen)){
                return res.sendFile(pathImagen)
            }
        }

    } catch (err) {

    }

    return res.sendFile(pathImgAux); 
    
};

const actualizarImgCloudinary = async(req = request, res = response) =>{

    const {id, coleccion} = req.params;

    let modelo;

    switch(coleccion){
        case 'usuarios':

            modelo = await User.findById(id);
            if(!modelo){
                return res.status(400).json({msg: `No existe un usuario con el id ${id}`});
            }

        break;

        case 'productos':

            modelo = await Producto.findById(id);
            if(!modelo){
                return res.status(400).json({msg: `No existe un producto con el id ${id}`});
            }

        break;

        default:
            return res.status(500).json({msg: 'Se me olvidó validar esto'});

    }


    if(modelo.img){
        const nombreArr = modelo.img.split('/');
        const nombre = nombreArr[nombreArr.length - 1];
        const [public_id] = nombre.split('.');
        
        cloudinary.uploader.destroy(`Cafe/${coleccion}/${public_id}`);
    }

    const {tempFilePath} = req.files.archivo;
    const {secure_url} = await cloudinary.uploader.upload( tempFilePath , {
        folder: `Cafe/${coleccion}`
    });

    modelo.img = secure_url;

    await modelo.save();

    res.json({
        modelo
    });

};

export {cargarArchivo, actualizarImg, traerImg, actualizarImgCloudinary};