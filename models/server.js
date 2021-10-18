const express = require('express')
const cors = require('cors');
const fileUpload = require('express-fileupload');
const { createServer } = require('http');

const { dbConnection } = require('../db/config');
const { socketController } = require('../sockets/controller');

class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.server = createServer(this.app);
        this.io = require('socket.io')(this.server);

        this.paths = {
            auth: '/api/auth',
            buscar: '/api/buscar',
            categorias: '/api/categorias',
            productos: '/api/productos',
            usuarios: '/api/usuarios',
            uploads: '/api/uploads'
        }

        // this.usuariosPath = '/api/usuarios';
        // this.authPath = '/api/auth';

        // Conectar a base de datos
        this.conectarDB();

        // Middlewares: funciones que añaden otra fuincionalidad al web server
        this.middlewares();

        // Rutas de mi aplicación
        this.routes();

        // Sockets
        //método
        this.sockets();
    }

    async conectarDB() {
        await dbConnection();
    }

    middlewares() {

        // CORS
        this.app.use(cors());

        // Lectura y Parseo del body
        this.app.use(express.json());

        //Directorio público
        this.app.use(express.static('public'));

        // FileUpload - Carga de archivos
        this.app.use(fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            createParentPath: true
        }));


    }

    // Métodos
    routes() {

        this.app.use(this.paths.auth, require('../routes/auth'));
        this.app.use(this.paths.buscar, require('../routes/buscar'));
        this.app.use(this.paths.categorias, require('../routes/categorias'));
        this.app.use(this.paths.productos, require('../routes/productos'));
        this.app.use(this.paths.usuarios, require('../routes/usuarios'));
        this.app.use(this.paths.uploads, require('../routes/uploads'));
    }

    sockets(){
        //
        this.io.on("connection", (socket) => socketController(socket, this.io) );
    }

    listen() {
        this.server.listen(this.port, () => {
            console.log('Server runing on port ', this.port);
        })
    }

}


module.exports = Server;