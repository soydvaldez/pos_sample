"use strict";
import { ProductRepository } from '../data/product.repository.js';
import { PaginatorController } from './paginator.controller.js';

// Antes de renderizar los objetos de la tabla crea una copia en memoria para tener consistencia del estado
// de los datos antes de ser manipulados por el usuario


// Voy a tener que guardar el estado de la fila tanto en estilos como en informacion
// Por defecto:
let originalStateRow = {
    values: [],
    edition: false,
    style: {
        background: "yellow",
        height: "200px"
    }
}

// Editado por el usuario:
let editStateRow = {
    values: [],
    edition: true,
    style: {
        background: "yellow",
        height: "200px"
    }
}

// Esto persistelo en local storage


class CustomController {
    data$ = [];
    repository = undefined;
    HEADERS = ['id', 'nombre', 'descripcion', 'precio', 'stock'];
    paginatorMetada = {};
    currentPage = {};
    chunck = undefined;
    default_render_options = {
        collectio: 'products',
        limit: 10,
        order: 'asc'
    }
    chunksdata = [];
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

        this.TABLE.addEventListener('render_page', (e) => {

        });

        this.TBODY.addEventListener('hola_mundo', (e) => {
            alert('Evento hola mundo catched!');
        });

        // this.TABLE.addEventListener('click', (e) => {
        //     e.target.dispatchEvent(new CustomEvent('render', { bubbles: true }));
        // });

        document.addEventListener('render', (e) => {

        });

        this.TBODY.dispatchEvent(new CustomEvent('loadedAsyncData', { bubbles: true }));
        // this.TBODY.dispatchEvent(new CustomEvent('renderData', { bubbles: true }));
        // this.TABLE.dispatchEvent(new CustomEvent('click', { bubbles: true }));

        //Escucha eventos en toda la tabla:
        // Me subscribo al evento: 'renderData'

        this.TABLE.addEventListener('renderData', (e) => {

        });

        // Pon en un objeto un catalogo de funciones flecha:
        /*
        ordenar: ()=> {data}
        */

        // Funcion asincrona:
        this.loadAsyncProducts();

        // on
        // emmit
    }

    loadAsyncProducts() {
        this.repository.listar((products) => {
            // this.displaySpinner();
            // Copia del estado de la base de datos:
            // Cargando...
            this.data$ = products;
            // setTimeout(() => {
            //     this.removeSpinner();
            // }, 10000);

            if (this.data$) {
                this.generatorPaginatorMetadata();
                // Quita el spinner
                this.buildTable();           // Renderiza la tabla
                // this.buildTable([]);

                // Renderiza la tabla
                this.displayTable();
                this.addListenersTable();    // Agregar listeners
                this.addListenersTableOptions();    //Opciones: ()=>{ guardar }
                this.TBODY.dispatchEvent(new CustomEvent('renderData', { bubbles: true }));
            } else {
                // Quita el spinner

            }
        });
    }

    // Genera trozos de un array:
    // Mostrando pedazo (chunck) elementos del: page1: [1 - 10], page1:[11-20], page3:[21 -30]....
    // display: page 1 || display: last_page
    chunckArray(items, metadata) {
        let { collection, pages, elementsByPage, resto, totalElements, orderBy } = metadata;

        let init = 0;
        let last = elementsByPage - 1;
        let chunks = [];


        let hasRemaining = false;
        let lastRemaining = 0;

        function createInitPage(keyValues) {
            const { collection, totalElements, chunck, page, initElement,
                lastElement, items } = keyValues;

            let pageObj = {};
            pageObj['page' + page] = {
                collection,
                totalElements: totalElements || 0,
                page: page || 0,
                elements: {
                    firstElement: initElement || 0,
                    lastElement: lastElement || 0,
                },
                chunck: chunck || '',
                items: items || []
            }
            return pageObj;
        }

        // Genera y llena paginas:
        for (let i = 0; i < pages; i++) {
            let getItems = items.slice(init, last + 1);

            // Caso especial: aplica cuando hay elementos que no entraron en una pagina o no caben exactamente se agregan en otra pagina:
            // Evalua los elementos de una pagina y determina si hay remanentes
            if (getItems.length % elementsByPage != 0) {
                hasRemaining = true;
                lastRemaining = init + getItems.length;
            }
            let page = createInitPage({
                collection,
                totalElements: getItems.length,
                page: i + 1,
                initElement: init + 1,
                lastElement: (hasRemaining) ? lastRemaining : last + 1,
                chunck: (hasRemaining) ? `[${init + 1}-${lastRemaining}]` : `[${init + 1}-${last + 1}]`,
                items: getItems
            });
            hasRemaining = false;
            chunks.push(page);
            init = last + 1;
            last += elementsByPage;
        }
        this.chunksdata = chunks.map(c => c);
        let it = this.generateIterator([{ obj: 1 }, { obj: 2 }, { obj: 3 }, { obj: 4 }, { obj: 5 }]);
        let aux = undefined;

        do {
            aux = it.next();

        } while (aux.hasNext || aux.value != undefined);

        //Necesitas tener la metadata y la informacion de referencia del elemento
        //Que elemento es?
        this.chunck = chunks;
    }

    dispatchPage(noPage) {
        let findedPage = undefined;
        for (let chunck of this.chunck.values()) {
            if (chunck[`page${noPage}`]) {
                findedPage = chunck[`page${noPage}`];
                break;
            }
        }
        // added logic here:
        return findedPage;
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

    // Generate metadata for split data in pages
    generatorPaginatorMetadata() {
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
        let resto = {};

        // Hay resto?
        if ((totalElements % limit) > 0) {
            resto['hasRemaining'] = true;
            resto['remainingElements'] = totalElements - totalElementsPages;
            pages++;
        } else {
            resto['hasRemaining'] = false;
            resto['remainingElements'] = [];
        }

        let metadata = {
            collection: override_render_options.collection,
            pages,
            resto,
            totalElements,
            elementsByPage, orderBy
        };

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
        this.TBODY.innerHTML = `<tr><td class="spinner" colspan="5" style="text-align: center;"><div class="loader"></td></tr>`;
    }

    removeSpinner() {

        let spinner = this.TBODY.querySelector('.spinner');
        let sp = this.TBODY.querySelector('.loader');



        spinner.removeChild(sp);
    }

    showEmptyDataMessage() {
        this.TBODY.innerHTML = `<tr><td colspan="5" style="text-align: center;">NO AVAILABLE DATA</td></tr>`;
    }

    // Esta funcion esta por fuera de la tabla: y puede manipular o controlar el comportamiento o los elementos de la tabla.
    addListenersTableOptions() {
        // let btn_save = this.optionsBtn.querySelector('.btn-save');
        // btn_save.addEventListener('renderData', (e) => {

        // });

        // btn_save.dispatchEvent(new CustomEvent('renderData', { bubbles: true }));
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

        //Extrar la fila entera seleccionada por el usuario de la tabla de productos
        let getRowHTMLElement = (event) => {
            return event.target.parentElement;
        }

        //Estado original: Extrae los datos de las celdas de una fila y lo convierte en un objeto
        let extractRowData = (rowData) => {
            let values = rowData.children;
            console.log(values);
            let dataRow = {};

            for (let key of this.HEADERS) {
                console.log(key);
                dataRow[key] = values.namedItem(key).innerText;
            }
            return dataRow;
        }
        // El control de cambios se controla a traves de una pila. Pila de cambios

        let edicionObject = {}

        // Inicializa la base de datos en memoria:
        let generalRowState = {
            isEdited: false,
        };

        this.TBODY.addEventListener('input', (e) => {

            let row = getRowHTMLElement(e);
            let btn = row.querySelector('.actions').querySelector('.btn_table_edit');
            btn.disabled = false;

            // btn.addEventListener('click', (e) => {
            //     // let ele = getRowHTMLElement(e);
            //     // console.log('ele');
            // })

            // actions btn_table_edit
            // habilita el boton:

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

                    cellEdit.removeAttribute('style');
                }
            }
        });

        // Habilita el modo: edicion
        this.TBODY.addEventListener('click', (e) => {
            e.preventDefault();
            let className = e.target.parentElement.getAttribute('class');
            if (className === "form-detail-product__footer") {
                return;
            }

            let edit = e.target.tagName;


            //snapshot: Estado antes de modificar la fila:
            if (edit === "BUTTON" || edit === "I") {
                console.log({ ee: edit, values: originalStateRow });
                return;
            }

            originalStateRow = extractRowData(getRowHTMLElement(e));

            // Si ya existe la base de datos solo agrega otro elemento a la pila (Singleton pattern)
            if (!generalRowState['snapshot']) {
                generalRowState['snapshot'] = originalStateRow;
                generalRowState['changesDetected'] = edicionObject;
                return;
            }
            // agrega elemento a la pila


            // Estilos
            e.target.parentElement.style.transition = "5s";
            e.target.parentElement.style.backgroundColor = "yellow";
            e.target.parentElement.style.height = "200px";
            let children = e.target.parentElement.children;

            for (let child of e.target.parentElement.children) {

                if (child.getAttribute('name') === "id" || child.getAttribute('name') === "btn_edit") {
                    child.setAttribute("contenteditable", false);
                    continue;
                }

                // if (child.getAttribute('name') === "btn_edit") {
                //     child.setAttribute("contenteditable", false);
                //     continue;
                // }
                child.setAttribute("contenteditable", true);
            }

            // Accedo a mi base de datos de control de cambios:
            let snapshot = generalRowState.snapshot;

            editableElementRow = getRowHTMLElement(e);
            let rowProductHTML = extractRowData(getRowHTMLElement(e));
        });

        // Registra los items en un array los que cambien de estado a: 'modo_edicion'.
        // Si le ponen cancelar pedir confirmacion y regresar el item al estado anterior.
        // Si el array tiene cambios e intentan cambiar de pagina pedir confirmacion.

    }

    // Podria recibir un trozo de colecion de productos y en base a eso contruir la logica y estructura:
    // Este metodo construye la estructura html junto con los datos de productos.
    // Este metodo tiene una dependencia debil al metodo  addListenersTable()
    buildTable(chunckData) {
        // Pregunta si la tabla tiene hijos, si no tiene hijos saltate la condicion
        // cargar spinner:

        let rowsProducts = "";

        function createHeaders() {

        }

        let createRows = (product) => {
            let row = "";
            // for (let key of Object.keys(product)) {
            for (let key of this.HEADERS) {
                if (key === "id") {
                    row += `<td name="${key}">${product[key]}</td>`;
                } else {
                    row += `<td name="${key}">${product[key]}</td>`;
                }
            }

            // Permisos:
            row += `<td colspan="2" name="actions" class="actions">
            <i class="glyphicon glyphicon-menu-down custom"></>
            </td>`;
            return row;
        }

        // Al dar doble click habilitar la edicion el item y cambiar el color del componente. Al detectar algun cambio renderizar el boton
        // de actualizar.

        // Crea todas las filas de productos
        // Renderiza 10 (test) Aqui va a ir el archivo de opeciones de renderizado:
        let targetItems = this.data$.slice(0, 10);

        let dataIterable = chunckData && chunckData != undefined ? chunckData : targetItems;

        for (let product of dataIterable) {
            rowsProducts += `<tr classitem=${product.id}>${createRows(product)}</tr>`
        }

        // Renderizar filas: Esta responsabilidad tiene que ir encapsulada en otra funcion:
        // this.TBODY.innerHTML += rowsProducts;

        return;
    }

    // Esta funcion tiene la responsabilidad de renderizar la tabla de productos en el html
    // Depende de: this.buildTable();
    displayTable() {
        let { items, metadata } = this.paginator
        this.chunckArray(items, metadata);
    }



}

function registryEvento() {

}

// Inyeccion de dependencias para acceder a la data de la app
// let repository = new ProductRepository();
// let ctrl = new CustomController(repository);

export { CustomController };