'use strict'

// Otra regla: Si el numero de total de items dividido entre el limit es menor a 1 entonces
// solo abra una pagina en la coleccion

class Paginator {
    //estructuras auxiliares de ayuda para construir el paginador
    collection = "";
    data = [];
    Settings = { limit: 10, orderBy: 'asc' };
    Metadata = {
        totalElements: 0, pages: 0,
        remainingElements: {
            hasRemaining: false,
            numberRemainingElements: 0
        },
        elementsByPage: "", orderBy: ""
    };

    pagesList = new Array();
    totalPages = 0;

    // buildPages depende de generateMetadata
    // Dede de llegar usn objeto:{ nombre: "products", items: [1,2,3,4...]}
    // Entrada: data[] salida el array data dividido en paginas
    constructor(data, settings) {
        const { collection, items } = data;
    
        if (settings) {
            // this.Settings = settings || this.Settings;
            this.Settings = this.Settings;
        }

        
        // Datos generales de la coleccion:
        this.data = items;
        this.collection = collection;
        this.totalElements = this.data.length;
        // Dispara la ejeccion del proceso principal:
        this.run();
    }

    run() {
        this.generateMetadata();
        this.buildPages();
    }

    calculateNumberPages() {
        let elementsByPage = this.Settings.limit;
        let totalPages = 0;

        if (this.totalElements < elementsByPage) {
            pages = 1;
            this.totalPages = pages;
            return pages;
        }

        totalPages = Math.ceil(this.totalElements / elementsByPage);
        this.totalPages = totalPages;
        return totalPages;
    }

    hasRemainingElements() {
        let elementsByPage = this.Settings.limit;
        return (this.totalElements % elementsByPage != 0);
    }

    // Con esto se responde la pregunta del los elementos restantes:
    // true or false
    calculateRemainingElements() {
        let remainingElements = {};

        const numberRemainingElements = this.totalElements % this.Settings.limit;

        if (this.hasRemainingElements()) {
            remainingElements['hasRemaining'] = true;
            remainingElements['dataRemainingElements'] = [];
            remainingElements['numberRemainingElements'] = numberRemainingElements;
        }
        return remainingElements;
    }

    // Generate metadata for split data in pages
    // metodo de acceso privado
    // Agrupo todas las respuestas
    // Aqui realiza las preguntas
    generateMetadata() {
        this.Metadata.totalElements = this.totalElements;
        this.Metadata.pages = this.calculateNumberPages();
        this.Metadata.elementsByPage = this.Settings.limit;
        this.Metadata.orderBy = this.Settings.orderBy;
        this.Metadata.remainingElements = this.calculateRemainingElements();
    }

    createPage(data) {
        let chunks_items = `[${data.firstItem}-${data.lastItem}]`;
        let Page = {
            first_item: data.firstItem,
            last_item: data.lastItem,
            chunck: data.chunck,
            total_items_chunck: data.totalItemsChunck,
            page: data.currentPage,
            page_number: data.numberPage,
            chunks_items: chunks_items
        };
        return Page;
    }

    // split data based on metada info
    buildPages() {
        const COUNT_TOTAL_PAGES = this.Metadata.pages;
        // Controla los segmentos:
        let initItem = 0;
        let lastItem = 0;

        let chunckAux = [];
        let totalItemsChunck = 0;
        let currentPage = 0;
        let cloneArray = structuredClone(this.data);

        for (currentPage; currentPage < COUNT_TOTAL_PAGES; currentPage++) {
            let numberPage = `${currentPage + 1} of ${COUNT_TOTAL_PAGES}`;

            //Controladores: Setteo y/o Actualiza datos para la siguiente iteracion
            initItem = lastItem;
            lastItem = lastItem + this.Metadata.elementsByPage;

            // segmentando items para llenar la pagina:
            chunckAux = cloneArray.slice(initItem, lastItem);
            totalItemsChunck = chunckAux.length;

            // Case especial: Que pasa si hay menos items para la pagina?
            if (chunckAux.length < this.Metadata.elementsByPage) {
                lastItem = initItem + chunckAux.length;
            }

            let pageItemAux = initItem + 1;
            let obj = this.createPage({
                firstItem: pageItemAux,
                lastItem: lastItem,
                chunck: chunckAux,
                totalItemsChunck: totalItemsChunck,
                numberPage: numberPage,
                currentPage: currentPage + 1
            });

            // Agregar pagina:
            this.pagesList.push(obj);
        }

        // Puedes agregar un formateador para la salida del proceso
    }

    dispatchPage(number_page) {
        let index = number_page - 1;
        return this.pagesList[index];
    }

    // Vamos a hacer un iterator
    generateIterator() {
        var index = 0;
        let pages = structuredClone(this.pagesList);
        return {
            next: () => {
                return (index < pages.length) ?
                    {
                        value: pages[index++], hasNext: true
                    } : {
                        value: pages[index++], hasNext: false
                    }
            }
        };
    }

    getPages() {
        return this.pagesList;
    }

    // Funciones para exponer: serviran para controlar la iteracion de las paginas
    getTotalPages() {
        return this.totalPages;
    }
}
function test() {
    // const database = require('../data/store/db.json');
    //Leemos desde el api o desde el local_storage:
    let products = database.products.splice(0, 21);
    let paginator
        = new Paginator(
            { collection: "products", items: products },
            { limit: 5, orderBy: 'asc' }
        );
    let page = paginator.dispatchPage(4);
    let iterator = paginator.generateIterator();
    let aux = undefined;

    do {
        console.log({ ...aux });
        aux = iterator.next();
    } while (aux.hasNext);

    // handlerPage:
    //target:
    // next(): ()=>{ } : Me devolvera la siguiente pagina
}
// module.exports = { Paginator };
export { Paginator };