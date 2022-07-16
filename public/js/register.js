
let registerForm = document.querySelector('form'); 
const API_URL = 'http://localhost:5555/auth/register'; 

registerForm.addEventListener('submit', (event) =>{
    event.preventDefault(); 
    const registerData = new FormData(registerForm); 

    const email = registerData.get('email');   
    const password = registerData.get('password'); 


    registerForm.reset(); 

    const registerDataToSend = {
        'email': email, 
        'password': password
    }; 

    const xhr = new XMLHttpRequest(); 
    xhr.open('POST', API_URL); 

    xhr.setRequestHeader('Content-Type', 'application/json'); 
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest'); 

    xhr.send(JSON.stringify(registerDataToSend)); 

    xhr.onload = () => {
        console.log(JSON.parse(xhr.responseText.toString()));
        window.location.href = JSON.parse(xhr.responseText.toString()); 
    }; 

}); 