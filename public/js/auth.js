

const miFormulario = document.querySelector('form');
miFormulario.addEventListener('submit', ev =>{
    ev.preventDefault();

    const formData = {}

    for( let el of miFormulario.elements ){
        if(el.namespaceURI.length > 0)
            formData[el.name] = el.value
    }

    fetch( url+'login', {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: { 'Content-Type': 'application/json' }
    })
    .then(resp => resp.json() )
    .then( ({ msg, token }) =>{
        if(msg){
            return console.error( msg );
        }

        localStorage.setItem('token', token);
        window.location = 'chat.html';
    })
    .catch(err =>{
        console.log(err);
    })
});


const url = (window.location.hostname.includes('localhost'))
    ? 'http://localhost:8080/api/auth/'
    : 'http://192.168.1.67:8080/api/auth/';
    //: 'https://restserver-rea.herokuapp.com/api/auth/';

function handleCredentialResponse(response) {

    // Google token : ID_TOKEN
    //console.log('id_token', response.credential);
    const body = { id_token: response.credential };
    fetch(url+"google", {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(body)
    })
        .then(resp => resp.json())
        //.then( data => console.log('nuestro server', data) )
        .then(({ token }) => {
            console.log(token);
            localStorage.setItem('token', token);
            window.location = 'chat.html';
        })
        .catch(console.warn())
}

const button = document.getElementById('google_singout');
button.onclick = () => {
    console.log(google.accounts.id);
    google.accounts.id.disableAutoSelect();

    google.accounts.id.revoke(localStorage.getItem('email'), done => {
        localStorage.clear();
        location.reload();
    });
}