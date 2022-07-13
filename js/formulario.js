
// Animacion tarjeta

//Accedo al contenedor tarjeta que quiero rotar
const tarjeta = document.querySelector('#tarjeta'),
    btnAbrirFormulario = document.querySelector('#btn-abrir-formulario'),
    formulario = document.querySelector('#formulario-tarjeta'),
    btnEnviar = document.querySelector('.btn-enviar'),
    numeroTarjeta = document.querySelector('#tarjeta .numero'),
    nombreTarjeta = document.querySelector('#tarjeta .nombre'),
    firma = document.querySelector('#tarjeta .firma p'),
    logoMarca = document.querySelector('#logo-marca'),
    mesExpiracion = document.querySelector('#tarjeta #expiracion .mes'),
    yearExpiracion = document.querySelector('#tarjeta #expiracion .year'),
    ccv = document.querySelector('#tarjeta .ccv');

//FUNCION PARA VOLTEAR TARJETA
const mostrarFrente = () =>{
    if (tarjeta.classList.contains('active')){
        tarjeta.classList.remove('active');
    }
}

//ROTAR TARJETA
tarjeta.addEventListener('click', () => {
	tarjeta.classList.toggle('active');
});

//rotacion del boton +
btnAbrirFormulario.addEventListener('click', () =>{
    btnAbrirFormulario.classList.toggle('active');
    formulario.classList.toggle('active');
});

//Select del mes
for(let i = 1; i<=12; i++){
    let opcion = document.createElement('option');
    opcion.value = i;
    opcion.innerText = i;
    formulario.selectMes.appendChild(opcion);
}

//Select del año
//Establezco un metodo para saber el anho actual
const yearActual = new Date().getFullYear();
for (let i = yearActual - 4; i <= yearActual + 8; i++){
    let opcion = document.createElement('option');
    opcion.value = i;
    opcion.innerText = i;
    formulario.selectYear.appendChild(opcion);
};

//Evitar submit al presionar enter
const prevenirEnvio = document.querySelectorAll(".prevenir-envio");
prevenirEnvio.forEach(elemento => {
	elemento.addEventListener("keydown", (evento) => {
		if (evento.key == "Enter") {
			// Prevenir
			evento.preventDefault();
			return false;
		}
	});
});

//INPUT NUMERO DE TARJETA

//keyup identificar cuando el usuario levanta el dedo de la tecla
formulario.inputNumero.addEventListener('keyup',(e)=>{
    //guardo el valor del input
    let valorInput = e.target.value;
    //anhado un metodo replace con el argumento de una expresion regular
    //expresion regular busco letras, espacios iniciales finales
    formulario.inputNumero.value = valorInput
    .replace(/\s/g,'') //busca espacios en blanco 
    .replace(/\D/g,'') //busca todo lo que no sea del 0 al 9
    .replace(/([0-9]{4})/g, '$1 ')//busque del 0 al 9 y los agrupe de a 4 
    .trim() 

    numeroTarjeta.textContent = valorInput;
    if(valorInput == ''){
        numeroTarjeta.textContent = 'xxxx xxxx xxxx xxxx';
        logoMarca.innerHTML = '';
    }

    if(valorInput[0]== 4){
        logoMarca.innerHTML = '';
        const imagen = document.createElement('img');
        imagen.src = '../asset/visa.png';
        logoMarca.appendChild(imagen);
    } else if(valorInput[0]== 5){
        logoMarca.innerHTML = '';
        const imagen = document.createElement('img');
        imagen.src = '../asset/mastercard.png';
        logoMarca.appendChild(imagen);
    } else if(valorInput[0]== 3){
        logoMarca.innerHTML = '';
        const imagen = document.createElement('img');
        imagen.src = '../asset/american.jpg';
        logoMarca.appendChild(imagen);
    }

    //Voltear la tarjeta para que vea al frente
    mostrarFrente();

});

// Input nombre tarjeta

formulario.inputNombre.addEventListener('keyup', (e) => {
    let valorInput = e.target.value;

    formulario.inputNombre.value = valorInput.replace(/[0-9]/g,'');
    nombreTarjeta.textContent = valorInput;
    firma.textContent = valorInput;

    if(valorInput == ''){
        nombreTarjeta.textContent = 'Agatha Gomez';
    }
    mostrarFrente ();
});



//mostrar mes/anho
formulario.selectMes.addEventListener('change', (e) =>{
    mesExpiracion.textContent = e.target.value;
    mostrarFrente();
});

formulario.selectYear.addEventListener('change', (e) =>{
    yearExpiracion.textContent = e.target.value.slice(2);
    mostrarFrente();
});

// ccv
formulario.inputCCV.addEventListener('keyup', () =>{
    if(!tarjeta.classList.contains('active')){
        tarjeta.classList.toggle('active');
    }
    formulario.inputCCV.value = formulario.inputCCV.value
    .replace(/\s/g,'') //busca espacios en blanco 
    .replace(/\D/g,'')
    .trim();

    ccv.textContent = formulario.inputCCV.value;
});


btnEnviar.addEventListener('click',(e) =>{
        Swal.fire({
            title: '¡GRACIAS POR TU COMPRA!',
            text:'Tu compra sera enviada dentro de las siguientes 24hs.',
            width: 600,
            padding: '3em',
            color: '#716add',
            position: 'center',
            confirmButtonText: 'Listo',
            backdrop: `
            rgba(0,0,123,0.4)
            url("../asset/nyan-cat-nyan.gif")
            left top
            no-repeat
            `
        })
        .then((result) => {
            if (result.value) {
                location.reload();
                localStorage.getItem("swal");
            }
        })
        
        e.preventDefault(); // para evitar que la pagina recargue y se puede var el mensaje
});


