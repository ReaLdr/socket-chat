const url = (window.location.hostname.includes('localhost'))
    ? 'http://localhost:8080/api/auth/'
    : 'http://192.168.1.67:8080/api/auth/';
    //: 'https://restserver-rea.herokuapp.com/api/auth/';



let usuario = null;
let socket = null;

// Referencias html
const txtUid        = document.querySelector('#txtUid');
const txtMensaje    = document.querySelector('#txtMensaje');
const ulUsuarios    = document.querySelector('#ulUsuarios');
const ulMensaje     = document.querySelector('#ulMensaje');
const btnSalir      = document.querySelector('#btnSalir');

// Validar el token del localstorage
const validarJWT = async() =>{

    const token = localStorage.getItem('token') || '';

    if(token.length <= 10){
        window.location = 'index.html';
        throw new Error('No hay token en el servidor');
    }

    const respuesta = await fetch( url,  {
        headers: { 'x-token': token }
    });

    const { usuario: userDB, token: tokenDB } = await respuesta.json();
    // console.log(userDB, tokenDB);
    localStorage.setItem('token', tokenDB);
    usuario = userDB;
    document.title = usuario.nombre;

    await conectarSocket();

}

const conectarSocket = async() =>{
    
    socket = io({
        'extraHeaders': {
            'x-token': localStorage.getItem('token')
        }
    });

    socket.on('connect', () =>{
        console.log('Sockets online');
    });
   
    socket.on('disconnect', () =>{
        console.log('Sockets offline');
    });

    socket.on( 'recibir-mensajes', dibujarMensajes );
    
    socket.on( 'usuarios-activos', dibujarUsuarios );
    
    socket.on('mensaje-privado', (payload) =>{
        console.log('Privado: ', payload);
    });

}

const dibujarUsuarios = (usuarios = [])=>{

    let usersHtml = '';
    usuarios.forEach( ({nombre, uid}) =>{
        usersHtml += `
        <li>
        <p>
        <h5 class="text-success"> ${nombre}</h5>
        <spann class="fs-6 text-muted"> ${uid} </spann>
        </p>
        </li>
        `;
    });

    ulUsuarios.innerHTML = usersHtml;

}

const dibujarMensajes = (mensajes = [])=>{

    let mensajesHtml = '';
    mensajes.forEach( ({nombre, mensaje}) =>{
        mensajesHtml += `
        <li>
            <p>
                <span class="text-primary"> ${nombre}:</span>
                <span> ${mensaje} </span>
            </p>
        </li>
        `;
    });

    ulMensaje.innerHTML = mensajesHtml;

}

txtMensaje.addEventListener('keyup', ({keyCode}) =>{
    
    const mensaje = txtMensaje.value,
          uid = txtUid.value;

    if(keyCode !== 13){
         return;
    }
    if(mensaje.length === 0){
         return;
    }

    console.log('ID: ', uid);

    socket.emit('enviar-mensaje', { mensaje, uid });
    txtMensaje.value = '';


})

const main = async() =>{

    // validar JWT
    await validarJWT()

}

main();
