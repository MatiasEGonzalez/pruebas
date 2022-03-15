document.addEventListener('DOMContentLoaded', () => {
    const categorias = ["DESAYUNO Y MERIENDA ", "ALMUERZO Y CENA ", "POSTRES ", "BEBIDAS "];
    
    class Lista {
        constructor(id, nombre, precio, category, imgValor) {
            this.id = parseInt(id);
            this.nombre = nombre;
            this.precio = parseFloat(precio);
            this.category = category;
            this.img = imgValor;
        }
    
        sumarIva() {
            this.precio = this.precio * 1.21;
        }
    }

    // Variables
    let baseDeDatos = [];

    let carrito = [];
    const divisa = '$';
    const DOMitems = document.getElementById('items');
    const DOMcarrito = document.querySelector('#carrito');
    const DOMtotal = document.querySelector('#total');
    const DOMbotonVaciar = document.querySelector('#boton-vaciar');
    const miLocalStorage = window.localStorage;

    const listaProductos = [];

listaProductos.push(new Lista(1, "pizza", 600, categorias[1], "./img/pizza.jpg"));
listaProductos.push(new Lista(2, "milanesa con pure", 550, categorias[1], "./img/milanesaConPure.jpg"));
listaProductos.push(new Lista(3, "milanesa con ensalada", 550, categorias[1], "./img/milanesaConEnsalada.jpg"));
listaProductos.push(new Lista(4, "milanesa con papas fritas", 550, categorias[1], "./img/milanesasConPapasFritas.jpg"));
listaProductos.push(new Lista(5, "asado con pure", 550, categorias[1], "./img/asadoConPure.jpg"));
listaProductos.push(new Lista(6, "asado con ensalada", 550, categorias[1], "./img/asadoConEnsalada.jpg"));
listaProductos.push(new Lista(7, "sopa de verduras", 550, categorias[1], "./img/sopa.jpg"));
listaProductos.push(new Lista(8, "pastafrola", 150, categorias[0], "./img/pastafrola.jpg"));
listaProductos.push(new Lista(9, "cafe con leche", 220, categorias[0], "./img/cafeConLeche.jpg"));
listaProductos.push(new Lista(10, "flan", 170, categorias[2], "./img/flan.jpg"));
listaProductos.push(new Lista(11, "helado", 240, categorias[2], "./img/helado.jpg"));
listaProductos.push(new Lista(12, "fernet con coca", 450, categorias[3], "./img/fernetConCoca.jpg"));
listaProductos.push(new Lista(13, "cerveza pinta", 220, categorias[3], "./img/cervezaPinta.jpg"));
listaProductos.push(new Lista(14, "cerveza botella", 340, categorias[3], "./img/cervezaBotella.jpg"));
listaProductos.push(new Lista(15, "coca cola", 170, categorias[3], "./img/cocaCola.jpg"));
listaProductos.push(new Lista(16, "sprite", 170, categorias[3], "./img/sprite.jpg"));

  
    function renderizarProductos() {
        listaProductos.forEach((info) => {
            // Estructura
            const miNodo = document.createElement('div');
            miNodo.classList.add('card', 'col-sm-4');
            // Body
            const miNodoCardBody = document.createElement('div');
            miNodoCardBody.classList.add('card-body');
            // Titulo
            const miNodoTitle = document.createElement('h5');
            miNodoTitle.classList.add('card-title');
            miNodoTitle.textContent = info.nombre;
            // Precio
            const miNodoPrecio = document.createElement('p');
            miNodoPrecio.classList.add('card-text');
            miNodoPrecio.textContent = `${info.precio}$`;


        


            //Stock
            const miNodoImg = document.createElement('img');
            miNodoImg.classList.add('card-text');
            miNodoImg.textContent = `${info.img}`;
            // Boton 
            const miNodoBoton = document.createElement('button');
            miNodoBoton.classList.add('btn', 'btn-primary');
            miNodoBoton.textContent = 'Agregar al pedido';
            miNodoBoton.setAttribute('marcador', info.id);
            miNodoBoton.addEventListener('click', anyadirProductoAlCarrito);
            // Insertamos
            miNodoCardBody.appendChild(miNodoTitle);
            miNodoCardBody.appendChild(miNodoPrecio);
            miNodoCardBody.appendChild(miNodoImg);
            miNodoCardBody.appendChild(miNodoBoton);
            miNodo.appendChild(miNodoCardBody);
            DOMitems.appendChild(miNodo);
        });
    }

    /**
    * Evento para añadir un producto al carrito de la compra
    */
    function anyadirProductoAlCarrito(e) {
        // Anyadimos el Nodo a nuestro carrito
        carrito.push(e.target.getAttribute('marcador'))
        // Actualizamos el carrito 
        renderizarCarrito();
        // Actualizamos el LocalStorage
        guardarCarritoEnLocalStorage();
    }

    /**
    * Dibuja todos los productos guardados en el carrito
    */
    function renderizarCarrito() {
        // Vaciamos todo el html
        DOMcarrito.textContent = '';
        // Quitamos los duplicados
        console.log(carrito)
        const carritoSinDuplicados = [...new Set(carrito)];
        //console.log(carritoSinDuplicados)
        // Generamos los Nodos a partir de carrito
        carritoSinDuplicados.forEach((item) => {
            // Obtenemos el item que necesitamos de la variable base de datos
            const miItem = listaProductos.filter((itemBaseDatos) => {
                // ¿Coincide las id? Solo puede existir un caso
                return itemBaseDatos.id === parseInt(item);
            });
            // Cuenta el número de veces que se repite el producto
            const numeroUnidadesItem = carrito.reduce((total, itemId) => {
                // ¿Coincide las id? Incremento el contador, en caso contrario no mantengo
                return itemId === item ? total += 1 : total;
            }, 0);
            // Creamos el nodo del item del carrito
            const miNodo = document.createElement('li');
            miNodo.classList.add('list-group-item', 'text-right', 'mx-2');
            miNodo.textContent = `${numeroUnidadesItem} x ${miItem[0].nombre} - ${miItem[0].precio}${divisa}`;
            // Boton de borrar
            const miBoton = document.createElement('button');
            miBoton.classList.add('btn', 'btn-danger', 'mx-5');
            miBoton.textContent = 'X';
            miBoton.style.marginLeft = '1rem';
            miBoton.dataset.item = item;
            miBoton.addEventListener('click', borrarItemCarrito);
            // Mezclamos nodos
            miNodo.appendChild(miBoton);
            DOMcarrito.appendChild(miNodo);
        });
        // Renderizamos el precio total en el HTML
        DOMtotal.textContent = calcularTotal();
    }

    /**
    * Evento para borrar un elemento del carrito
    */
    function borrarItemCarrito(e) {
        // Obtenemos el producto ID que hay en el boton pulsado
        const id = e.target.dataset.item;
        // Borramos todos los productos
        carrito = carrito.filter((carritoId) => {
            return carritoId !== id;
        });
        // volvemos a renderizar
        renderizarCarrito();
        // Actualizamos el LocalStorage
        guardarCarritoEnLocalStorage();

    }

    /**
     * Calcula el precio total teniendo en cuenta los productos repetidos
     */
    function calcularTotal() {
        // Recorremos el array del carrito 
        []
        return carrito.reduce((total, item) => {
            // De cada elemento obtenemos su precio
            const miItem = listaProductos.filter((itemBaseDatos) => {
                return itemBaseDatos.id === parseInt(item);
            });
            // Los sumamos al total
            return total.sumarIva() + miItem[0].precio;
        }, 0).toFixed(2);
    }

    /**
    * Varia el carrito y vuelve a dibujarlo
    */
    function vaciarCarrito() {
        // Limpiamos los productos guardados
        carrito = [];
        // Renderizamos los cambios
        renderizarCarrito();
        // Borra LocalStorage
        localStorage.clear();

    }

    function guardarCarritoEnLocalStorage () {
        miLocalStorage.setItem('carrito', JSON.stringify(carrito));
    }

    function cargarCarritoDeLocalStorage () {
        // ¿Existe un carrito previo guardado en LocalStorage?
        if (miLocalStorage.getItem('carrito') !== null) {
            // Carga la información
            carrito = JSON.parse(miLocalStorage.getItem('carrito'));
        }
    }

    // Eventos
    DOMbotonVaciar.addEventListener('click', vaciarCarrito);

    // Inicio
    cargarCarritoDeLocalStorage();
    renderizarProductos();
    renderizarCarrito();
});