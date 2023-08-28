import { ProductRepository } from './data/product.repository.js';
// Antes de renderizar los objetos de la tabla crea una copia en memoria para tener consistencia del estado
// de los datos antes de ser manipulados por el usuario

class CustomController {
    data$ = [];
    repository = undefined;
    HEADERS = ['id', 'nombre', 'descripcion', 'precio', 'stock'];
    default_options = {
        limit: 10,
        order: 'asc'
    }

    createHeaders = "";
    // Edicion
    // Fila original
    // Fila Editada
    // Que pasa si el usuario quiere regresar a una version anterior 'deshacer'

    constructor(repository) {
        this.repository = repository;

        this.optionsBtn = document.querySelector('.options');
        this.TABLE = document.querySelector('table');
        this.THEAD = this.TABLE.querySelector('thead');     //Para escuchar los ordenamientos
        this.TBODY = this.TABLE.querySelector('tbody');

        this.TBODY.addEventListener('renderData', (e) => {
            console.log('propagacion 1');
        });

        //Escucha eventos en toda la tabla:
        // Me subscribo al evento: 'renderData'

        this.TABLE.addEventListener('renderData', (e) => {
            console.log('propagacion 2');
        });

        // Pon en un objeto un catalogo de funciones flecha:
        /*
        ordenar: ()=> {data}
        */

        // Funcion asincrona:
        this.loadAsyncProducts();
    }

    loadAsyncProducts() {
        this.repository.listar((products) => {
            this.displaySpinner();
            // Copia del estado de la base de datos:
            // Cargando...
            this.data$ = products;

            if (this.data$) {
                // Quita el spinner
                this.buildTable();           // Renderiza la tabla
                this.addListenersTable();    // Agregar listeners
                this.addListenersTableOptions();    //Opciones: ()=>{ guardar }
                this.TBODY.dispatchEvent(new CustomEvent('renderData', { bubbles: true }));
            } else {
                // Quita el spinner
                console.log('Data set is empty');
            }
        });
    }

    displaySpinner() {
        console.log('Feature not supported yet');
    }

    addListenersTableOptions() {
        let btn_save = this.optionsBtn.querySelector('.btn-save');
        btn_save.addEventListener('renderData', (e) => {
            console.log('Hola mundo');
        });

        btn_save.dispatchEvent(new CustomEvent('renderData', { bubbles: true }));
        // 'empty table'
    }
    // Sincronizar es que los datos que tengas en memoria esten holomogados con los del repositorio mandatorio (Estado actual del negocio).
    // Debe de haber un historial de cambios en las filas: y se debe de acceder por una busqueda para recuparar el snapshot
    /* 
            Puede agregar la propiedad: contenteditable y quitarla con otra accion
            Debo programar un controlador que lleve el control de cambios sobre las celdas y sepa cuendo se edito o cuando
            volvio al estado original.
    */


    // Centrate en el contexto: Es decir que hace en conjunto la funcion junto con todos sus componentes

    // Agrega escuchas a la tabla:
    // Escucha para edicion de productos
    addListenersTable() {
        // Cuando hagan click cuarda el id del articulo
        let originalStateRow = undefined;
        let editableElementRow = undefined;

        let edicionObject = {}

        // Inicializa la base de datos en memoria:
        let generalRowState = {
            isEdited: false,
        };

        //Extrar la fila entera seleccionada por el usuario de la tabla de productos
        let getRowHTMLElement = (event) => {
            return event.target.parentElement;
        }

        this.TBODY.addEventListener('click', (e) => {
            e.preventDefault();
            //snapshot: Estado antes de modificar la fila:
            originalStateRow = extractRowData(getRowHTMLElement(e));

            // Si ya existe la base de datos solo agrega otro elemento a la pila (Singleton pattern)
            if (!generalRowState['snapshot']) {
                generalRowState['snapshot'] = originalStateRow;
                generalRowState['changesDetected'] = edicionObject;
                return;
            }
            // agrega elemento a la pila
            return;
        });

        // Extrae los datos de las celdas de una fila y lo convierte en un objeto
        // Estado original:
        let extractRowData = (rowData) => {
            let values = rowData.children;
            let dataRow = {};

            for (let key of this.HEADERS) {
                dataRow[key] = values.namedItem(key).innerText;
            }
            return dataRow;
        }
        // El control de cambios se controla a traves de una pila. Pila de cambios

        this.TBODY.addEventListener('input', (e) => {
            // Accedo a mi base de datos de control de cambios:
            let snapshot = generalRowState.snapshot;

            editableElementRow = getRowHTMLElement(e);
            let rowProductHTML = extractRowData(getRowHTMLElement(e));

            if (e.target.tagName === "TD") {
                let cellEdit = e.target;
                cellEdit.style.backgroundColor = "#C333";

                let key = cellEdit.getAttribute('name');
                let value = cellEdit.innerText;
                edicionObject['id'] = rowProductHTML.id;

                // Persiste los cambio hechos sobre la fila
                if (edicionObject['id']) {
                    // Si ya existe la estructura solo agrega el nuevo valor
                    edicionObject[key] = value;
                    generalRowState['edicionObject'] = edicionObject;
                }

                // Comparar estados:
                if (snapshot[key] === e.target.innerText) {
                    console.log('El contenido de la fila regreso al estado original');
                    cellEdit.removeAttribute('style');
                }
            }

        });


    }

    // Esperar a que renderice la tabla
    buildTable() {
        let thead = this.TABLE.querySelector('thead');

        let rowsProducts = "";
        function createHeaders() {
            console.log('Feature not supported yet');
        }

        // console.log(this.HEADERS);

        // No esta dentro del contexto de la funcion
        let createRows = (product) => {
            let row = "";
            // for (let key of Object.keys(product)) {
            for (let key of this.HEADERS) {
                if (key === "id") {
                    row += `<td contenteditable="false" name="${key}">${product[key]}</td>`;
                } else {
                    row += `<td contenteditable="true" name="${key}">${product[key]}</td>`;
                }
            }
            return row;
        }

        // Crea todas las filas de productos
        for (let product of this.data$) {
            rowsProducts += `<tr item=${product.id}>${createRows(product)}</tr>`
        }

        // Renderizar filas
        this.TBODY.innerHTML += rowsProducts;
        return;
    }
}

// Inyeccion de dependencias para acceder a la data de la app
let repository = new ProductRepository();
let ctrl = new CustomController(repository);