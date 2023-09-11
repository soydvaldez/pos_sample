// script para manejar los datos de los productos
// import { data } from '../store/db.json';

// Capa para aislar la logica para acceso a datos:
class Product {
    constructor(id, nombre, descripcion, precio, stock) {
        this.id = id;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.precio = precio;
        this.stock = stock;
    }
}

class ProductDao {
    URL_SERVER = 'http://localhost:3000';
    // LOCAL_STORE = '../../../../store/db.json';
    LOCAL_STORE = './js/data/store/db.json';

    constructor() {
        this.listar = this.listar.bind(this);
    }

    /**
     * 
     * @param {*} callback - Necesita un callback para encapsular la respuesta asincrona.
     */
    listar(callback) {
        let products = [];
        let request = new XMLHttpRequest();
        request.open('GET', this.LOCAL_STORE);
        request.setRequestHeader('Content-Type', 'application/json');
        request.send();

        request.onreadystatechange = function (e) {
            if (this.readyState == 4 && this.status == 200) {
                let response = JSON.parse(this.response);

                for (let product of response.products) {
                    products.push(new Product(product.id, product.nombre, product.descripcion, product.precio, product.stock));
                }
                callback(products);
            }
        }
    }

    agregar(product, callback) {
        let request = new XMLHttpRequest();
        request.open('POST', `${this.URL_SERVER / products}`);
        request.setRequestHeader('Authorization', 'bearer' + jwttoken);
        request.send(product);

        request.onreadystatechange = function (e) {
            if (this.code === '200') {
                console.log('response');
            }
        }

        callback({ message: 'producto registrado', error: 'false' });
    }
}

export { ProductDao, Product };