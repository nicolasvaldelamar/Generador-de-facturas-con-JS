const tbody = document.querySelector('#tbody');
const tabla1 = document.querySelector('.tabla1');
const tabla2 = document.querySelector('.tabla2');
const num_prod_span = document.querySelector('.numero_producto')

export class baseService { 
    constructor(){
        this.total = [];
        this.totalT = 0;
        this.desc = 0;
        this.num = 1;
        this.productos = [];
        this.numero_prod = [];
        this.precio = [];
        this.totalTotal = 0;
    }
    infoClientClean(numero_factura, date, clientName, direccion, tel, email){
        return {
            numero_fac: numero_factura.value,
            fecha: date.value,
            nombre_client: clientName.value,
            direccion: direccion.value,
            telefono: tel.value,
            email: email.value,
        }
    }
    agregarProducto(target){
        this.reajustarNumeroProducto();  
        const tr = document.createElement('tr');
        const th = document.createElement('th');
        tr.classList.add('bg-white', 'border-b', 'dark:bg-gray-800', 'dark:border-gray-700');
        th.scope = 'row';
        th.classList.add('px-6', 'py-4', 'font-medium', 'text-gray-900', 'whitespace-nowrap', 'dark:text-white');
        th.innerHTML = this.num_producto;
        tr.append(th);
        const td1 = document.createElement('td');
        td1.classList.add('px-6', 'py-4');
        td1.innerHTML = target.producto.value;
        if(!isNaN(target.producto.value[0])){
            return;
        }
        const td2 = document.createElement('td');
        td2.classList.add('px-6', 'py-4');
        td2.innerHTML = target.cantidad.value;
        const td6 = document.createElement('td');
        td6.classList.add('px-6', 'py-4');
        const input = document.createElement('input');
        input.type = 'number';
        input.min = '5';
        input.max = '100';
        input.step = '5';
        input.value = '0';
        input.classList.add('form-control', 'form-control-sm', 'input-desc');
        const td4 = document.createElement('td');
        td4.innerHTML = parseInt(target.cantidad.value) * parseInt(target.precio.value)+" COP";
        input.onchange = () => {
            let p = this.calcularPrecio(input.value,parseInt(target.cantidad.value), parseInt(target.precio.value))
            td4.innerHTML = p+" COP";  
            this.reajustarNumeroProducto();  
        };
        td6.append(input);
        const td3 = document.createElement('td');
        td3.classList.add('px-6', 'py-4');
        td3.innerHTML =  `${target.precio.value} COP`;
        td4.classList.add('px-6', 'py-4', 'costo');
        this.total.push((parseInt(target.cantidad.value) * parseInt(target.precio.value))) 
        const td5 = document.createElement('td');
        td5.classList.add('px-6', 'py-4');
        const btn = document.createElement('button');
        btn.classList.add('btn', 'btn-danger', 'btn-sm', 'delete');
        btn.onclick = () => this.eliminarProducto(btn);
        btn.innerHTML = 'X';
        td5.append(btn);
        tr.append(td1, td2, td3, td6, td4, td5);
        tbody.append(tr);
        this.num_producto++;
       
    }

    reajustarNumeroProducto() {
        // Obtener todas las filas de la tabla de productos
        const filas = document.querySelectorAll('#tbody tr');
    
        // Actualizar el número de producto para cada fila
        filas.forEach((fila, index) => {
          const th = fila.querySelector('th');
          th.innerHTML = index + 1;
        });
    
        // Actualizar el número de producto en la propiedad num_producto
        this.num_producto = filas.length + 1;
      }

    eliminarProducto(boton) {
        // Obtenemos la fila actual
        let fila = boton.parentNode.parentNode;
        // Eliminamos la fila
        fila.parentNode.removeChild(fila);

        // Reajustar el número de producto
        this.reajustarNumeroProducto();
      }

    getSubTotal(){
        let totalCosto = 0;
        const costoCells = document.querySelectorAll('#tbody td.costo');
      
        costoCells.forEach((cell) => {
          const costoValue = parseInt(cell.textContent);
          if (!isNaN(costoValue)) {
            totalCosto += costoValue;
          }
        });
      
        return totalCosto;
      }

    calcularDescuentoEiva(descuento, iva){
        let count = parseInt(tbody.childElementCount);
        let sub = this.getSubTotal();
        let resDes = sub - (sub * (descuento/100));
        let resIva = resDes + (resDes * (iva/100));
        return {
            descuento: resDes,
            iva: resIva,
        }
    }

    getCantidadDesc(){
        return this.desc;
    }

    getTotal(){
        return parseInt(this.totalT); 
    }

    generarPDF(infoClient){
        const doc = new jsPDF();
        doc.text("NOMBRE CLIENTE: "+infoClient.nombre_client+'\n', 10, 10);
        doc.text("NUMERO FACTURA: "+infoClient.numero_fac+'\n', 10, 20);
        doc.text("FECHA: "+infoClient.fecha+'\n', 10, 30);
        doc.text("DIRECCION: "+infoClient.direccion+'\n', 10, 40);
        doc.text("EMAIL: "+infoClient.email+'\n', 10, 50);
        let str = this.recorrerTabla(tabla1);
        let str2 = this.recorrerTabla(tabla2)
        doc.text(str2, 10, 60);
        //hacer que str se agrege al final de la pagina pdf
        doc.text(str, 10, 150);
        doc.save('a4.pdf');
    }

    recorrerTabla(tabla) {
        let str = '';
        const tabla1 = tabla;
        for (let i = 0; i < tabla1.rows.length; i++) {
          for (let j = 0; j < tabla1.rows[i].cells.length; j++) {
            const cell = tabla1.rows[i].cells[j];
            let cellValue = '';
      
            if (cell.innerHTML !== 'undefined') {
              const innerHTMLContent = cell.innerHTML;
      
              if (innerHTMLContent.includes('<')) {
                const tempElement = document.createElement('div');
                tempElement.innerHTML = innerHTMLContent;
                const inputElement = tempElement.querySelector('input');
                cellValue = inputElement ? inputElement.value : innerHTMLContent;
              } else {
                cellValue = innerHTMLContent;
              }
            }
      
            str += cellValue + '\t';
          }
          str += '\n';
        }
        return str;
      }
      
      

    calcularPrecio(desc, precio, cantidad){
        let sub = precio * cantidad;
        sub = sub - ((sub * parseInt(desc))/100);
        this.totalTotal = parseInt(sub);
        return sub;
    }  

}

