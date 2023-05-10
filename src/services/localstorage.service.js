import { guardarLocalStorage, extraerLocalStorage, eliminarLocalStorage } from "../helpers/localstorage.mjs";

const KEY = 'products'

export class GuardarEnDataBase {
    constructor (){
        this.products = [
            {
                id: 1,
                name: 'HELADO DE VAINILLA',
                price: 6000,
            },
            {
                id: 2,
                name: 'HELADO DE CHOCOLATE',
                price: 3000,
            },
            {
                id: 3,
                name: 'HELADO DE NATA',
                price: 5000,
            },
            {
                id: 4,
                name: 'HELADO DE MANGO',
                price: 3000,
            },
            {
                id: 5,
                name: 'MALTEADA DE CHOCOLATE',
                price: 6000,
            },
            {
                id: 6,
                name: 'HELADO DE COROZO',
                price: 6000,
            },
            {
                id: 7,
                name: 'JUGO HIT',
                price: 2000,
            },
            {
                id: 8,
                name: 'JUGO DE AGUACATE',
                price: 6500,
            }
        ]
        this.init();
    }

    init(){
        guardarLocalStorage(KEY, this.products);
    }

    getAllProducts(){
        let data = extraerLocalStorage(KEY);
        this.products = data;
        return this.products;
    }

    add(item){
        this.products.push(item);
        eliminarLocalStorage(KEY);
        guardarLocalStorage(KEY, this.products);
        return item;
    }
}