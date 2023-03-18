import { Socket } from "socket.io";
import { comprobarJWT } from "../helpers/generar-jwt.js";
import { ChatMensajes } from "../models/chat-mensajes.js";

const chatMensajes = new ChatMensajes();

const socketController = async(socket = new Socket(), io) =>{

    const token = socket.handshake.headers['x-token'];
    const usuario = await comprobarJWT(token);

    if(!usuario){
        return socket.disconnect();
    }

    //Agregar el usuario conectado
    chatMensajes.conectarUsuario(usuario);
    io.emit('usuarios-activos', chatMensajes.usuariosArr);
    socket.emit('recibir-mensajes', chatMensajes.ultimos10);

    //Conectarlo a una sala especial 
    socket.join(usuario._id.toString());

    //Limpiar cuando alguien se desconecta
    socket.on('disconnect', ()=>{
        chatMensajes.desconectarUsuario(usuario.uid);
        io.emit('usuarios-activos', chatMensajes.usuariosArr);
    });

    socket.on('enviar-mensaje', ({uid, mensaje})=>{
        
        if(uid){
            //Mensaje Privado
            socket.to(uid).emit('mensaje-privado', {de: usuario.nombre, mensaje});
        }else{
            chatMensajes.enviarMensaje(usuario.uid, usuario.nombre, mensaje);
            io.emit('recibir-mensajes', chatMensajes.ultimos10);
        }

    });

    //Enviar mensajes
    io.emit('recibir-mensajes', chatMensajes.ultimos10);

};

export {socketController};