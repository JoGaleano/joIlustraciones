/* clase Producto */
class Producto
{
    constructor(producto)
    {
        //DESESTRUCTURACION 
        ({ id:this.id, imgUrl:this.imgUrl, titulo:this.titulo, precio:this.precio} = producto);
        this.cantEnCarrito = 0; //CANTIDAD SELECCIONADA EN EL CARRITO DE ESE PRODUCTO
    }

}

/* clase Carrito */
class Carrito
{
    constructor()
    {
        this.productosCarrito = [];
    }

    agregarProducto(productoCompra,eTarget)
    {
        if(this.buscarProducto(productoCompra) == null)
        {
            //se agrega el producto por primera vez en el carrito.
            this.productosCarrito.push(productoCompra);
            //actualizo cantidad en badge del carrito
            document.getElementById('badgeCarrito').textContent++;
            productoCompra.cantEnCarrito = productoCompra.cantEnCarrito == 0 ? 1 : productoCompra.cantEnCarrito;
            let contenedorProdCarrito = document.querySelector('#infoCarritoMain');
            const divProdCarrito = document.createElement('div');
            divProdCarrito.style.border = '1.5px groove #808080';
            divProdCarrito.style.marginBottom = '.5rem';
            divProdCarrito.style.marginLeft = '.5rem';
            divProdCarrito.style.paddingTop = '.5rem';
            divProdCarrito.style.paddingBottom = '.5rem';
            divProdCarrito.style.textAlign = 'center';
            divProdCarrito.classList.add('shadow','bg-body','rounded');
            divProdCarrito.setAttribute('id', productoCompra.titulo.replace(/ /g, ""));
            //Boton cerrar
            const divBtnCerrar = document.createElement('div');
            divBtnCerrar.style.paddingRight = '.5rem';
            divBtnCerrar.style.textAlign = 'right';

            const btnCerrar = document.createElement('button');
            btnCerrar.classList.add('btn-close');
            divBtnCerrar.appendChild(btnCerrar);
            divBtnCerrar.onclick = oyenteBtnQuitarProducto;
            //imagen del producto
            const imgProducto = document.createElement('img');
            imgProducto.setAttribute('src', productoCompra.imgUrl);
            imgProducto.classList.add('card-img-top');
            imgProducto.style.maxWidth = '50%';

            const textoTitulo = document.createElement('h5');
            textoTitulo.innerText = productoCompra.titulo;

            const textoProducto = document.createElement('p');
            textoProducto.innerText = 'Cantidad: ' + productoCompra.cantEnCarrito;
            textoProducto.style.marginBottom = '.25rem';
            //creo botones para modificar la cantidad del producto agregado
            const btnIncrementarProducto = document.createElement('button');
            const btnDecrementarProducto = document.createElement('button');
            btnIncrementarProducto.classList.add('btn', 'btn-info', 'btn-sm');
            btnIncrementarProducto.onclick = oyentBtnModifCantProducto;
            btnDecrementarProducto.classList.add('btn', 'btn-danger', 'btn-sm');
            btnDecrementarProducto.style.marginLeft = '.8rem';
            btnDecrementarProducto.onclick = oyentBtnModifCantProducto;
            btnIncrementarProducto.textContent = '+';
            btnIncrementarProducto.style.background = '#597A3A';
            btnIncrementarProducto.style.color = '#ffffff';
            btnDecrementarProducto.textContent = '-';
            divProdCarrito.appendChild(divBtnCerrar);
            divProdCarrito.appendChild(imgProducto);
            divProdCarrito.appendChild(textoTitulo);
            divProdCarrito.appendChild(textoProducto);
            divProdCarrito.appendChild(btnIncrementarProducto)
            divProdCarrito.appendChild(btnDecrementarProducto);
            contenedorProdCarrito.appendChild(divProdCarrito);
            comprados.push(eTarget);
        } 
        else
        {
            productoCompra.cantEnCarrito++; //solamente aumento la cantidad del producto en el carrito porque ya se encuentra en él.
            document.querySelector(`#${productoCompra.titulo.replace(/ /g, "")} p`).innerText = 'Cantidad: ' + productoCompra.cantEnCarrito;
        } 
    }
    
    buscarProducto(producto)
    {
        return this.productosCarrito.find( prod =>  prod.id == producto.id);
    }

    buscarPorTitulo(tituloProducto)
    {
        return this.productosCarrito.find( prod =>  prod.titulo.replace(/ /g, "") == tituloProducto);
    }

    quitarProducto(tituloProducto)
    {
        const cantProductos = this.productosCarrito.length;
        let eliminado = [];
        let i = 0, encontre = false;
        while(!encontre && (i < cantProductos))
        {
            if(this.productosCarrito[i].titulo.replace(/ /g, "") == tituloProducto)
            {
                this.productosCarrito[i].cantEnCarrito = 0;
                eliminado = this.productosCarrito.splice(i,1);
                document.getElementById('badgeCarrito').textContent--;
                encontre = true;
            }
            else
                i++;
        }
        return eliminado[0];
    }

    totalCompra()
    {
        return this.productosCarrito.reduce((valorTotal, producto) => valorTotal + (producto.precio *1.21) * producto.cantEnCarrito, 0);
    }

    totalCompraEnCuotas(cantCuotas)
    {
        //hasta 6 cuotas sin interés
        //por cada cuota hay un 5% de interés
        return (cantCuotas >= 0) && (cantCuotas <=6) ? this.totalCompra() : this.totalCompra() * ( 1 + 0.05 * cantCuotas);
    }

    valorCuota(cantCuotas)
    {
        return this.totalCompraEnCuotas(cantCuotas) / cantCuotas;
    }
}

// CLASE TIENDA
class Tienda{
    constructor()
    {
        this.listaProductos = [];
        this.carrito = new Carrito();
    }

    /* se agrega un producto a la tienda */
    agregarProducto(producto)
    {
        this.listaProductos.push(producto);
    }

    /* Devuelve el producto con el título ingresado como párametro. Si no se encuentra el producto, retorna 0 */
    buscarProducto(idProducto)
    {
        let producto = 0;
        for (let productoTienda of this.listaProductos)
        {
            if(productoTienda.id == idProducto) 
                producto = productoTienda;
        }
        return producto;
    }
}

// TIENDA

function crearOrdenar()
{
    const selectOrdenar = document.getElementById('select-ordenar');
    selectOrdenar.onchange = function()
    {
        const ordenElegido = selectOrdenar.value;
        if(ordenElegido == 'precio-ascendente')
            sortPrecioMenorMayor();
        else
            if(ordenElegido == 'precio-descendente')
                sortPrecioMayorMenor();
        selectOrdenar.blur(); //quito el foco del elemento
    };
}


function crearTienda()
{
    let nuevaTienda = new Tienda();
    return nuevaTienda;
}

//CARGAR LOS PRODUCTOS DESDE EL JSON
function fetchProductos()
{
    document.addEventListener('DOMContentLoaded' , () => {
        fetchData();
    })

    const fetchData = async () => {
        try{
            const res = await fetch('../json/productos.json');
            const data = await res.json();
            cargarProductos(data);
            sortPrecioMayorMenor();
        }
        catch(error)
        {
            console.log(error);
        }
    }
}

function cargarProductos(data)
{
    data.forEach(producto => {
        tienda.agregarProducto(new Producto(producto));
    });
}

function pintarCardsTienda()
{
    const items = document.getElementById('items');
    const templateCard = document.getElementById('template-card').content;
    const fragment = document.createDocumentFragment(); 

    tienda.listaProductos.forEach( producto => {
            templateCard.querySelector('img').setAttribute('src', producto.imgUrl);
            templateCard.querySelector('h5').textContent = producto.titulo;
            templateCard.querySelector('p').textContent = "$ " + producto.precio;
            templateCard.querySelector('p').style.fontSize = '1.75rem';
            templateCard.querySelector('.btn-dark').dataset.id = producto.id;

            const clone = templateCard.cloneNode(true);
            fragment.appendChild(clone);
        });
    items.appendChild(fragment);
    
    items.addEventListener('click', e => {
        oyenteBtnComprar(e.target);
        e.stopPropagation();
    })
}

function removerCardsTienda()
{
    let listaNodos = document.querySelector('#items');
    let padreItems = document.querySelector('#items').parentNode;
    listaNodos.remove();

    //creo un nuevo contenedor que contendrá las cards de productos
    let nuevoItems = document.createElement('div');
    nuevoItems.setAttribute('id', 'items');
    nuevoItems.classList.add('row');
    padreItems.insertBefore(nuevoItems, document.querySelector('.main__contenedor__banner'));
}

//OYENTE 
function oyenteBtnComprar(eTarget)
{      
    if(eTarget.classList.contains('btn-dark'))
    {
        //ID DEL BOTON CLIKEADO
        const btnAgregar =  eTarget.parentElement.querySelector('.btn-dark');
        const producto = tienda.buscarProducto(btnAgregar.dataset.id);
        if(producto != 0)  //SI EXISTE EL PRODUCTO
        {
            //si el producto no está en el carrito entonces lo almaceno en el localStorage
            tienda.carrito.buscarProducto(producto) == null && agregarLocalStorage(producto,eTarget);
            if(tienda.carrito.productosCarrito.length == 0)
            {
                document.getElementById('infoCarritoFooter').innerText = '';
                crearFooterCarrito();
            }
            tienda.carrito.agregarProducto(producto,eTarget);

            btnAgregar.onanimationstart = function(){
                btnAgregar.textContent = 'agregado al carrito';
                Toastify({
                    text: "AGREGADO AL CARRITO",
                    offset: {
                        x: '8rem', 
                        y: 9 },   
                    style: {
                        background: "linear-gradient(90deg, rgba(176,59,103,1) 35%, rgba(203,111,111,1) 100%)",
                        }
                    }).showToast();
            };
            btnAgregar.onanimationend =  function() {
                btnAgregar.textContent = 'Comprar';
                btnAgregar.classList.remove('animacionBtnAgregarCarrito');
            };

            btnAgregar.classList.add('animacionBtnAgregarCarrito');
            actualizarTotal();
        }
    }
}

//FUNCIONES CARRITO
function crearFooterCarrito()
{
    let contenedorFooter = document.getElementById('infoCarritoFooter');
    const separador = document.createElement('hr');
    const lblValorCompra = document.createElement('h4');
    lblValorCompra.textContent = 'Total: $';
    lblValorCompra.style.textAlign = 'center';
    lblValorCompra.style.color = '#7e3d49';
    lblValorCompra.style.fontFamily = 'Quicksand';
    contenedorFooter.appendChild(separador);
    contenedorFooter.appendChild(lblValorCompra);
    crearMenuCuotasCarrito();
    crearBtnFinalizarCompraCarrito();
}

function crearMenuCuotasCarrito()
{
    const cuotas = [1,3,6,9,12,18,24];
    let contenedorCompra = document.getElementById('infoCarritoFooter');
    const lblCuotas = document.createElement('p');
    lblCuotas.innerText = 'Cuotas disponibles';
    const selectMenu = document.createElement('select');
    contenedorCompra.appendChild(lblCuotas);
    contenedorCompra.appendChild(selectMenu);
    lblCuotas.style.margin = '0px 0px 0px';
    lblCuotas.style.textAlign = 'center';
    selectMenu.classList.add('form-select', 'form-select-sm', 'selectCuotas');
    selectMenu.style.alignSelf = 'center';
    const fragment = document.createDocumentFragment();
    for (const cuota of cuotas)
    {
        const optionMenu = document.createElement('option');
        optionMenu.textContent = cuota;
        fragment.appendChild(optionMenu);
    }
    selectMenu.appendChild(fragment);

    const btnCalcularCuota = document.createElement('button');
    btnCalcularCuota.textContent = 'Calcular';
    btnCalcularCuota.classList.add('btn','btn-outline-secondary','btn-sm', 'mx-auto');

    const lblValorCuota = document.createElement('h6');
    lblValorCuota.style.alignSelf = 'center';

    btnCalcularCuota.onclick = function()
    {
        lblValorCuota.textContent = 'Cuota: $' + tienda.carrito.valorCuota(selectMenu.value).toFixed(2);
    };
    
    contenedorCompra.appendChild(btnCalcularCuota);
    contenedorCompra.appendChild(lblValorCuota);
}

function crearBtnFinalizarCompraCarrito()
{
    let contenedorBtn = document.getElementById('infoCarritoFooter');
    const btnFinalizarCompra = document.createElement('button');
    btnFinalizarCompra.textContent = "FINALIZAR COMPRA";
    contenedorBtn.appendChild(btnFinalizarCompra);
    btnFinalizarCompra.classList.add('btn', 'btn-success', 'mx-auto');
    btnFinalizarCompra.addEventListener('click', () => 
    {
        if(tienda.carrito.totalCompra == 0)
            mensajeErrorCompra();
        else
        {
            mensajeCompraExitosa();
        } 
    });
}

function eliminarFooterCarrito()
{
    let contenedorFooter = document.getElementById('infoCarritoFooter');
    Array.from(contenedorFooter.children).forEach( hijo => {
        hijo.remove();
    });
}

function eliminarCarrito()
{
    tienda.carrito.productosCarrito.forEach(producto => {
        tienda.carrito.quitarProducto(producto.titulo);
        Array.from(document.querySelector('#infoCarritoMain').children).forEach( hijo => {
            hijo.remove();
        });
    });
    eliminarTodoLocalStorage();
    eliminarFooterCarrito();
    document.getElementById('infoCarritoFooter').textContent = 'Carrito vacío';
    
}

function oyenteBtnQuitarProducto(event)
{
    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
        },
        buttonsStyling: false
    })
    Swal.fire({
        title: '¿Está seguro que desea eliminar este producto?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí',
        cancelButtonText: 'No',
    }).then((result) => {
        if (result.isConfirmed)
        {
            const divAEliminar = event.target.parentNode.parentNode;
            //REMUEVO EL PRODUCTO
            const eliminado = tienda.carrito.quitarProducto(divAEliminar.id);
            eliminarLocalStorage(eliminado); 
            Array.from(divAEliminar.children).forEach( hijo => {
                hijo.remove();
            });
            document.querySelector('#infoCarritoMain').removeChild(divAEliminar);

            event.target.remove();
            //
            actualizarTotal();
            //SI EL CARRITO SE QUEDA SIN PRODUCTOS SE ELIMINA EL FOOTER
            if(tienda.carrito.productosCarrito.length == 0)
            {
                eliminarTodoLocalStorage();
                eliminarFooterCarrito();
                document.getElementById('infoCarritoFooter').textContent = 'Carrito vacío';
            }    
        }
    })
}

function oyentBtnModifCantProducto(event)
{
    //IDENTIFICO EL PRODUCTO
    let producto = tienda.carrito.buscarPorTitulo(event.target.parentElement.id);

    event.target.classList.contains('btn-info') ? producto.cantEnCarrito++    
    : producto.cantEnCarrito > 1 && producto.cantEnCarrito--;        
    event.target.parentElement.querySelector('p').innerText = 'Cantidad: ' + producto.cantEnCarrito;
    actualizarTotal();
    agregarLocalStorageProd(producto); 
}

function actualizarTotal()
{
    document.querySelector('#infoCarritoFooter h4').textContent = 'Total: $ ' + tienda.carrito.totalCompra().toFixed(2);
}


function mensajeCompraExitosa()
{
    const cantCuotas = parseInt(document.querySelector("#infoCarritoFooter select").value);
    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
        },
        buttonsStyling: false
    })

    Swal.fire({
        title: '',
        icon: 'info',
        html:
            '<a href="view/formulario.html"><b>PAGAR</b></a> ',
        showCloseButton: true,
        showCancelButton: true,
        focusConfirm: false,
        confirmButtonText:
        'Ir',
        confirmButtonAriaLabel: 'Thumbs up, great!',
        cancelButtonText:
        'Cancelar',
        cancelButtonAriaLabel: 'Thumbs down'
    }).then((result) => {
        if (result.isConfirmed) {
            window.location.href = "../view/formulario.html";
        }
    })
}

//Local Storage 
function agregarLocalStorageProd(producto)
{
    const productoEnJSON = JSON.stringify(producto);
    localStorage.setItem(producto.id, productoEnJSON);
}

function agregarLocalStorage(producto, eTarget)
{
    const productoEnJSON = JSON.stringify(producto);
    localStorage.setItem(producto.id, productoEnJSON);
    const eTargetEnJSON = JSON.stringify(eTarget.outerHTML);
    localStorage.setItem(`btn${producto.id}`,eTargetEnJSON);
}

function eliminarLocalStorage(producto)
{
    localStorage.removeItem(`btn${producto.id}`);
    localStorage.removeItem(producto.id);
}

function eliminarTodoLocalStorage()
{
    localStorage.clear();
}

function restaurarLocalStorage()
{
    for(let i= 0; i < localStorage.length; i++)
    {
        let clave = localStorage.key(i);
        const valor = JSON.parse(localStorage.getItem(clave));
        if(!(clave.includes('btn')))
        {
            const valorETarget = JSON.parse(localStorage.getItem('btn'+clave)); 
            if(tienda.carrito.productosCarrito.length == 0)
            {
                document.getElementById('infoCarritoFooter').innerText = '';
                crearFooterCarrito();
            }
            tienda.carrito.agregarProducto(valor,valorETarget);
            actualizarTotal();
        }
    }
}

//Sort
function sortPrecioMenorMayor()
{
    removerCardsTienda();
    //ordeno los productos de menor a mayor según el precio
    tienda.listaProductos.sort((a,b)=>{ return a.precio - b.precio});
    //pinto las cards de los productos
    pintarCardsTienda();
}

function sortPrecioMayorMenor()
{
    removerCardsTienda();
    //ordeno los productos de mayor a menor según el precio
    tienda.listaProductos.sort((a,b) => { return b.precio - a.precio});
    pintarCardsTienda();
}

//Creacion de elementos
let tienda = crearTienda();
crearOrdenar();
fetchProductos();
let comprados = []; //se utiliza para poder modificar la cantidad disponible del producto comprado.
restaurarLocalStorage();


