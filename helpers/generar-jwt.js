import jwt from 'jsonwebtoken';
import { User } from '../models/usuario.js';

const generarJWT = (uid = '') =>{

    return new Promise((resolve, reject) =>{

        const payload = { uid };

        jwt.sign(payload, process.env.SECRETORPUBLICKEY, {
            expiresIn: '4h'
        }, (err, token) =>{

            if(err){
                console.log(err);
                reject('No se pudo generar el token');
            }else{
                resolve(token);
            }

        });

    });
    
};

const comprobarJWT = async(token = '') =>{

    try {

        if(token.length < 10){
            return null;
        }

        const {uid} = jwt.verify(token, process.env.SECRETORPUBLICKEY);
        const usuario = await User.findById(uid);

        if(usuario){
            if(usuario.estado){
                return usuario;
            }else{
                return null;
            }
        }else{
            return null;
        }

    } catch (error) {
        return null;
    }

};

export {generarJWT, comprobarJWT};