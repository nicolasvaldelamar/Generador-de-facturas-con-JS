window.onload = () => {
    let fecha = new Date(); //Fecha actual
    let mes = fecha.getMonth()+1; //obteniendo mes
    let dia = fecha.getDate(); //obteniendo dia
    let ano = fecha.getFullYear(); //obteniendo año
    if(dia<10)
      dia='0'+dia; //agrega cero si el menor de 10
    if(mes<10)
      mes='0'+mes //agrega cero si el menor de 10
    document.getElementById('date').value=ano+"-"+mes+"-"+dia;
  }
  
//importaciones
import { baseService } from "./services/base.service.mjs";
const SevicioBase = new baseService();
import { GuardarEnDataBase } from "./services/localstorage.service.js";
const DataBaseService = new GuardarEnDataBase();
//datos factura
const numero_factura = document.querySelector('#numero_factura');
const date = document.querySelector('#date');
const clientName = document.querySelector('#client');

const direccion = document.querySelector('#direccion');
const tel = document.querySelector('#tel');
const email = document.querySelector('#email');

const card_producto = document.querySelector('#card_agregar_prod');
const agregar_prod = document.querySelector('.agregar_prod');

let conta = 1;
const numero_producto = document.querySelector('.numero_producto');
numero_factura.value = conta;
//agregar productos
const agregar_producto = document.querySelector('#agregar_product');
const nombre = document.querySelector('#nombre');
nombre.onchange = () => {
    const valor = nombre.value;
    
    if (valor.length > 0 && !isNaN(valor[0])) {
        alert('El primer carácter no puede ser un número.');
        nombre.style.border = '1px solid red !important';
    } else {
        nombre.style.border = ''; // Restablecer el estilo del contorno
    }
};

//elementos a los que se le agrega blur
const header = document.querySelector('header');
const tabla = document.querySelector('.tabla');
const footer = document.querySelector('footer')

const nohay = document.querySelector('.nohay');

const tbody = document.querySelector('#tbody');

const generarpdf = document.querySelector('.generarpdf');

const costo = document.querySelector('costo');
console.log(SevicioBase.getTotal());
const btnCerrarCard = document.querySelector('.btn-cerrar');
//variables
let contador = 0;

const miSelect = document.querySelector('#miSelect');
const productos = DataBaseService.getAllProducts();

productos.forEach(producto => {
    miSelect.innerHTML += `<option value="${producto.id}">${producto.name}</option>`;
});


//iniciando componentes
const StartFilters = () => {
    card_producto.style.display = 'none'
}

StartFilters();

btnCerrarCard.addEventListener('click', (e) => {
    e.preventDefault();
    cerrarCard();
})



const cerrarCard = () => {
    card_producto.style.display = 'none'
    header.style.filter = 'none';
    tabla.style.filter = 'none';
    footer.style.filter = 'none';
}

agregar_prod.addEventListener('click', (e) => {
    e.preventDefault();
    card_producto.style.display = 'block';
    header.style.filter = 'blur(5px)';
    tabla.style.filter = 'blur(5px)';
    footer.style.filter = 'blur(5px)';
    const select = document.getElementById("miSelect");
    const input_producto = document.getElementById("nombre");

    select.onchange = function () {
        const selectedOption = select.options[select.selectedIndex];
        input_producto.value = selectedOption.value !== "" ? selectedOption.text : "";
        console.log(selectedOption.innerHTML);
        for (let i = 0; i < productos.length; i++) {
            if(productos[i].name === selectedOption.innerHTML){
            const precio = document.querySelector('#precio');
            let filterproduct = productos.findIndex(producto => producto.name === selectedOption.innerHTML);
            precio.value = productos[filterproduct].price;

        }
    };
    }
    input_producto.oninput = function () {
        const inputValue = input_producto.value;
        const selectedOption = select.options[select.selectedIndex];

        if (selectedOption.text !== inputValue) {
            // Si el texto del input no coincide con la opción seleccionada,
            // establecer la opción seleccionada en vacío
            select.selectedIndex = -1;
        }
    };

})

const getInfoClient = () => {
    const info = SevicioBase.infoClientClean(numero_factura, date, clientName, direccion, tel, email);
    return info;
}
console.log(getInfoClient())
agregar_producto.addEventListener('submit', (e) => {
    e.preventDefault();
    SevicioBase.agregarProducto(e.target, contador);
    numero_producto.innerHTML = '';
    let num = contador = contador + 1;
    numero_producto.innerHTML = num;
    nohay.style.display = 'none';
    cerrarCard();
    calcularTotal(costo);
    console.log(SevicioBase.getTotal());
    console.log(getInfoClient())
    const nombre = document.querySelector('#nombre');
    const valor = nombre.value;
    if (valor.length > 0 && !isNaN(valor[0])) {
        e.preventDefault();
        alert('El primer carácter del nombre no puede ser un número. No se agregara');
        throw new Error('El primer carácter del nombre no puede ser un número.');
    }

})

const calcularTotal = (costo) => {
    console.log(costo)
}

const calcularSubTotalyMas = () => {
    const subtotal = document.querySelector('.subtotal');
    const descuento = document.querySelector('.descuento');
    const impuesto = document.querySelector('.impuesto');
    const total = document.querySelector('.total');
    impuesto.onchange = function () {
        let ob = SevicioBase.calcularDescuentoEiva(parseInt(descuento.value), parseInt(impuesto.value));
        total.innerHTML = ob.iva + ' COP';
    }
    descuento.onchange = function () {
        let ob = SevicioBase.calcularDescuentoEiva(parseInt(descuento.value), parseInt(impuesto.value));
        total.innerHTML = ob.iva + ' COP';
    }
    descuento.innerHTML = '';
    total.innerHTML = '';
    subtotal.innerHTML = '';
    let ob = SevicioBase.calcularDescuentoEiva(parseInt(descuento.value), parseInt(impuesto.value));
    descuento.value = SevicioBase.getCantidadDesc();
    total.innerHTML = ob.iva + ' COP';
    subtotal.innerHTML = SevicioBase.getSubTotal() + ' COP';
}

// Crea una nueva instancia del observador de mutación
const observador = new MutationObserver(function (mutations) {
    // Se ejecuta cada vez que hay cambios en el DOM
    mutations.forEach(function (mutation) {
        if (mutation.addedNodes.length > 0) {
            // Se ejecuta cuando se añade un nuevo hijo al elemento padre
            console.log('Se ha añadido un nuevo hijo al elemento padre');
            calcularSubTotalyMas();
        }
    });
});

// Configura las opciones del observador de mutación
const opcionesObservador = {
    childList: true, // Observa los cambios en la lista de hijos del elemento padre
    subtree: true // Observa los cambios en todos los descendientes del elemento padre
};

observador.observe(tbody, opcionesObservador);

calcularTotal(costo);

generarpdf.addEventListener('click', (e) => {
    e.preventDefault();
    SevicioBase.generarPDF(getInfoClient());
    numero_factura.value = conta + 1;
})

