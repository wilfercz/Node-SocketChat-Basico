import { response, request, json } from 'express';
import bcryptjs from 'bcryptjs';

import { User } from '../models/index.js';
import { generarJWT } from '../helpers/generar-jwt.js';
import { googleVerify } from '../helpers/google-verify.js';

const login = async(req=request, res=response) =>{

    const { correo, password } = req.body;
    
    try {

        //Verificar si el email existe
        const usuario = await User.findOne({correo});
        if (!usuario){
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - correo'
            });
        }

        //Si el usuario está activo
        if (!usuario.estado){
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - estado: false'
            });
        }

        //Verificar la constraseña
        const validPassword = bcryptjs.compareSync(password, usuario.password);
        if(!validPassword){
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - contraseña'
            });
        }

        //Generar el JWT
        const token = await generarJWT(usuario.id);

        res.json({
            usuario,
            token
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Hable con el administrador'
        })
    }

};

const googleSingIn = async(req = request, res = response) =>{

    const {id_token} = req.body;

    try {

        const {correo, nombre, img} = await googleVerify(id_token);

        let usuario = await User.findOne({correo});

        if(!usuario){
            //Tengo que crearlo
            const data = {
                nombre,
                correo,
                password: ':P',
                img,
                google: true
            };

            usuario = new User(data);
            await usuario.save();
        }

        //Si el usuario en BD
        if(!usuario.estado){
            return res.status(401).json({
                msg:'Hable con el administrador, usuario bloqueado'
            });
        }

        //Generar JWT
        const token = await generarJWT(usuario.id);

        res.json({
           usuario,
           token
        });   

    } catch(error) {
        console.log(error);
        res.status(400).json({
            ok: false,
            msg: 'El Token no se pudo verificar'
        });
    }

};

const renovarToken = async(req = request, res = response) =>{

    const usuario = req.usuario
    
    //Generar JWT
    const token = await generarJWT(usuario.id);

    res.json({
        usuario,
        token
    });
   
};


export {login, googleSingIn, renovarToken};