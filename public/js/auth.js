//Referencias
const url = `${window.location.origin}/api/auth/`;
const miFormulario = document.querySelector('form');

miFormulario.addEventListener('submit', (e)=>{
    e.preventDefault();

    const formData = {};

    for(let elemento of miFormulario){
        if(elemento.name.length > 0){
            formData[elemento.name] = elemento.value;
        }
    };

    fetch( url + 'login',{
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(formData)
    })
    .then(resp => resp.json())
    .then(({msg, token}) =>{
        if(msg){
            return console.error(msg);
        }

        localStorage.setItem('token', token);
        window.location = 'chat.html';
    })
    .catch(err =>{
        console.log(err);
    });
});

function handleCredentialResponse(response) {
           
    const body = { id_token: response.credential };

    fetch(url + 'google', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    })
        .then( resp => resp.json())
        .then( resp => {
            localStorage.setItem('token', resp.token);
            localStorage.setItem('email', resp.usuario.correo);
            window.location = 'chat.html';
        })
        .catch(console.warn);
};

function cerrarSesion(){
    google.accounts.id.disableAutoSelect();
    
    google.accounts.id.revoke(localStorage.getItem('email'), done =>{
    localStorage.clear();
    location.reload();
})

};