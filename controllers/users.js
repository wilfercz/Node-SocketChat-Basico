import { response, request } from 'express';
import bcryptjs from 'bcryptjs';

import { User } from '../models/index.js';

const usersGet = async(req = request, res = response)=>{

    //const params = req.query;
    const {limite = 5, desde = 0} = req.query;

    const [total, users] = await Promise.all([
        User.countDocuments({ estado:true }),
        User.find({ estado:true })
            .skip(Number(desde))
            .limit(Number(limite))
    ]);

    res.json({
        total,
        users
    });
};

const usersPost = async(req = request, res = response)=>{

    const { nombre, correo, password, rol } = req.body;
    const usuario = new User({nombre, correo, password, rol});

    //Encriptar la constraseña
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync( password, salt );

    //Guardar en BD
    await usuario.save();

    res.json({
        usuario
    });
};

const usersPut = async(req = request , res = response)=>{
    
    const { id } = req.params;
    const { _id, password, google, correo, ...resto } = req.body;

    //Validar contra base de datos
    if(password){
        //Encriptar la constraseña
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync( password, salt );
    }

    const updateUser = await User.findByIdAndUpdate(id, resto);

    res.json({
        updateUser
    });
};

const usersDelete = async(req = request, res = response)=>{

    const { id } = req.params;
    
    //Fisicamente lo borramos
    //const user = await User.findByIdAndDelete(id);

    const user = await User.findByIdAndUpdate(id, {estado:false});

    res.json({
        user
    });
};

const usersPatch = (req = request, res = response)=>{
    res.json({
        msg: 'PATCH API - Controlador'
    });
};


export {usersGet, usersPost, usersPut, usersDelete, usersPatch}; 