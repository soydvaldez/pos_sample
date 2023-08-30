import { ProductRepository } from './data/product.repository.js';
// Antes de renderizar los objetos de la tabla crea una copia en memoria para tener consistencia del estado
// de los datos antes de ser manipulados por el usuario

class CustomController {
    data$ = [];
    repository = undefined;
    HEADERS = ['id', 'nombre', 'descripcion', 'precio', 'stock'];
    paginator = {};
    default_render_options = {
        collectio: 'products',
        limit: 10,
        order: 'asc'
    }

    createHeaders = "";
    // Edicion
    // Fila original
    // Fila Editada
    // Que pasa si el usuario quiere regresar a una version anterior 'deshacer'

    // Formula para calcular paginas = total/limit
    // Si devuelve un numero entero es que es exacto sino  existe un resto que hay que mostrar
    // Si el modulo del total devuelve un numero mayor a cero son los elementos restantes
    // items to display = limit

    constructor(repository) {
        this.repository = repository;
        this.optionsBtn = document.querySelector('.options-container');
        this.TABLE = document.querySelector('table');
        this.THEAD = this.TABLE.querySelector('thead');     //Para escuchar los ordenamientos
        this.TBODY = this.TABLE.querySelector('tbody');

        this.TBODY.addEventListener('renderData', (e) => {
            // console.log('propagacion 1');
        });

        //Escucha eventos en toda la tabla:
        // Me subscribo al evento: 'renderData'

        this.TABLE.addEventListener('renderData', (e) => {
            // console.log('propagacion 2');
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
                this.settingsPaginator();
                // Quita el spinner
                this.buildTable();           // Renderiza la tabla
                this.displayTable();
                this.addListenersTable();    // Agregar listeners
                this.addListenersTableOptions();    //Opciones: ()=>{ guardar }
                this.TBODY.dispatchEvent(new CustomEvent('renderData', { bubbles: true }));
            } else {
                // Quita el spinner
                console.log('Data set is empty');
            }
        });
    }

    // Esta funcion tiene la responsabilidad de mostrar en pantalla y en elementos html los datos
    // Depende de: this.buildTable();
    displayTable() {
        let { items, metadata } = this.paginator
        this.chunckArray(items, metadata);
    }

    // Genera trozos de un array:
    chunckArray(items, metadata) {
        // Mostrando pedazo (chunck) elementos del: page1: [1 - 10], page1:[11-20], page3:[21 -30]....
        // display: page 1 || display: last_page

        let fragment = { page1: [1, 2, 3, 4], page1: [5, 6, 7, 8], page1: [9, 10] };

        const PAGES = metadata.pages;

        // for (let chunk of PAGES) {
        console.log({ PAGES });
        // }

        // let init = last_element +1;
        // let init = last_element +1
        // let init = items[];
        console.log(items.splice(0, 9));
        console.log(metadata);

        let it = this.generateIterator([{ obj: 1 }, { obj: 2 }, { obj: 3 }, { obj: 4 }, { obj: 5 }]);
        let aux = undefined;
        do {
            aux = it.next();
            console.log(aux.value);
        } while (aux.hasNext || aux.value != undefined);

        //Necesitas tener la metadata y la informacion de referencia del elemento
        //Que elemento es?
    }

    // Vamos a hacer un iterator
    generateIterator(array) {
        var index = 0;

        return {
            next: () => {
                return index < array.length ?
                    {
                        value: array[index++], hasNext: true
                    } : {
                        value: array[index++], hasNext: false
                    }
            }
        };
    }

    settingsPaginator() {
        let settings = { limit: 10, orderBy: 'asc' };
        let override_render_options = {};

        override_render_options = {
            collection: 'products',
            limit: settings.limit || 10,
            orderBy: settings.orderBy || 'asc'
        }
        const { limit, orderBy } = override_render_options;
        let totalElements = this.data$.length;

        let pages = parseInt(this.data$.length / limit);
        let elementsByPage = limit;
        let totalElementsPages = pages * limit;
        let resto = 0;

        // Hay resto?
        if ((totalElements % limit) > 0) {
            console.log('Hay elementos restantes');
            // Cuantos? //Aplica una diferencia
            // Agrega una tercera pagina con el resto
            resto = totalElements - totalElementsPages;
            pages++;
        }

        let metadata = { collection: override_render_options.collection, pages, resto, totalElements, elementsByPage, orderBy };
        this.paginator = {
            items: this.data$.map(m => m),
            metadata: metadata
        };

        // Por lo tanto, tengo tres paginas: dos paginas con 10 elementos cada una y una tercera pagina con 5 elementos
        // snippets of items
        // Mostrando pedazo (chunck) elementos del: [1 - 10], [11-20], [21 -30]....
        // display: page 1 || display: last_page
        // let init = last_element +1;
    }

    displaySpinner() {
        console.log('Feature not supported yet');
    }

    addListenersTableOptions() {
        let btn_save = this.optionsBtn.querySelector('.btn-save');
        btn_save.addEventListener('renderData', (e) => {
            console.log('DataTable renderizado');
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
        let rowsProducts = "";

        function createHeaders() {
            console.log('Feature not supported yet');
        }

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
        // Renderiza 10 (test) Aqui va a ir el archivo de opeciones de renderizado:
        let targetItems = this.data$.slice(0, 4);

        for (let product of targetItems) {
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