import {createServer} from 'http';

import {Server} from 'socket.io';
import express from 'express';
import cors from 'cors';

import { router } from '../routes/users.js';
import { routerAuth } from '../routes/auth.js';
import { dbConnection } from '../db/config.js';
import { routerCatg } from '../routes/categorias.js';
import { routerProduct } from '../routes/productos.js';
import { routerBusqueda } from '../routes/buscar.js';
import { routerUpload } from '../routes/uploads.js';
import fileUpload from 'express-fileupload';

import { socketController } from '../sockets/controller.js';

class Servidor {

    constructor(){
        this.app = express();
        this.port = process.env.PORT;
        this.server = createServer(this.app);
        this.io     = new Server(this.server);
        
        this.paths = {
            auth:      '/api/auth',
            categorias:'/api/categorias',
            users:     '/api/users',
            productos: '/api/productos',
            busqueda: '/api/busqueda',
            upload: '/api/cargar'
        }
        
        //Conectar a base de datos
        this.conectarDB();

        //Middlewares
        this.middlewares();

        //Rutas de la Aplicacion
        this.routes();

        //Sockets
        this.sockets();
    }

    async conectarDB(){
        await dbConnection();
    }

    middlewares(){
        //CORS
        this.app.use(cors());

        //Lectura y Parseo del Body
        this.app.use(express.json());

        //Directorio Público
        this.app.use(express.static('public'));

        //Carga de Archivos
        this.app.use(fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            createParentPath: true
        }));
    }

    routes(){
        this.app.use(this.paths.auth, routerAuth);
        this.app.use(this.paths.users, router);
        this.app.use(this.paths.categorias, routerCatg);
        this.app.use(this.paths.productos, routerProduct);
        this.app.use(this.paths.busqueda, routerBusqueda);
        this.app.use(this.paths.upload, routerUpload);
    }

    sockets(){
        this.io.on('connection', (socket) => socketController(socket, this.io));
    }

    listen(){
        this.server.listen(this.port, ()=>{
            console.log(`Aplicación desplegada en http://localhost:${this.port}...`);
        }); 
    }

};

export {Servidor};