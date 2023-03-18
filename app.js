
import dotenv from 'dotenv';
import {Servidor} from './models/server.js';

/* Variables de Entorno */
dotenv.config();

/* Servidor */
const server = new Servidor();

server.listen();