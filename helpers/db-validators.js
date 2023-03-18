import { Role } from '../models/rol.js';
import { User } from '../models/usuario.js';

import { Categoria, Producto } from "../models/index.js";

//Verificar que sea un rol válido
const esRolValido = async(rol = '') =>{

    const existeRol = await Role.findOne({rol});

    if(!existeRol){
        throw new Error(`El rol ${rol} no existe en la BD`);
    }
};

//Verificar si el correo existe
const existeEmail = async (correo = '') =>{
    const existeEmail = await User.findOne({correo});

    if ( existeEmail){
        throw new Error(`El correo ${correo} ya está en uso`);
    };
};

//Verificar si usuario existe
const existeUsuarioID = async (id = '') =>{
    const existeUsuario = await User.findById(id);

    if ( !existeUsuario){
        throw new Error('El Usuario no Exite');
    };

};

const existeCatg = async(id = '') =>{

    const existeCatg = await Categoria.findById(id);

    if ( !existeCatg){
        throw new Error('La Categoria no Exite');
    };

};

const existeProducto = async(id = '') =>{

    const existePrd = await Producto.findById(id);

    if ( !existeCatg){
        throw new Error('El Producto no Exite');
    };

};

const coleccionesPermitidas = (coleccion = '', colecciones = []) =>{

    const incluida = colecciones.includes(coleccion);

    if(!incluida){
        throw new Error(`La coleccion ${coleccion} no es permitida, ${colecciones}`);
    }

    return true;

};


export {esRolValido, existeEmail, existeUsuarioID, existeCatg, existeProducto, coleccionesPermitidas};