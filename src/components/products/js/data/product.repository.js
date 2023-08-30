// Accede a varias fuentes de datos
import { ProductDao } from './rest/productos.http.js';

class ProductRepository {
    // Inyecta el Dao
    constructor() {
        this.dao = new ProductDao();
        this.listar = this.listar.bind(this);
    }

    listar(callback) {
        return this.dao.listar(callback);
    }

    agregar(producto, callback) {
        this.dao.agregar(producto, callback);
    }
}

export { ProductRepository }