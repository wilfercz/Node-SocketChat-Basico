import {Schema, model} from "mongoose";

const UsuarioSchema = Schema({

    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    correo: {
        type: String,
        required: [true, 'El correo es obligatorio'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'La constraseña es obligatoria']
    },
    img: {
        type: String,
    },
    rol: {
        type: String,
        required: true,
        default: 'USER_ROLE'
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }

}); 

UsuarioSchema.methods.toJSON = function (){
    const { __v, password, _id, ...user } =this.toObject();
    user.uid = _id;

    return user;
}

const User = model( 'Usuario', UsuarioSchema );

export {User};
