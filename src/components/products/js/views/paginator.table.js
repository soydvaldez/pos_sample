'use strict'
const database = require('../data/store/db.json');

// Otra regla: Si el numero de total de items dividido entre el limit es menor a 1 entonces
// solo abra una pagina en la coleccion

class Paginator {
    //estructuras auxiliares de ayuda para construir el paginador
    collection = "";
    data = [];
    Page = {
        collection: this.collection,
        totalElements: 0,
        page: 0,
        elements: {
            firstElement: 0,
            lastElement: 0,
        },
        chunck: '',
        items: []
    };
    pagesList = new Array();

    Settings = { limit: 10, orderBy: 'asc' };
    Metadata = {
        totalElements: 0, pages: 0,
        remainingElements: {
            hasRemaining: false,
            numberRemainingElements: 0
        },
        elementsByPage: "", orderBy: ""
    };
    totalElements = 0;
    totalPages = 0;

    // buildPages depende de generateMetadata
    // Dede de llegar un objeto:{ nombre: "products", items: [1,2,3,4...]}
    // Entrada: data[] salida el array data dividido en paginas
    constructor(data) {
        const { collection, items } = data;
        this.data = items;
        this.collection = collection;
        //Inicia la construccion de la metadata
        this.totalElements = this.data.length;
        this.generateMetadata();
        this.buildPages();
    }

    calculateNumberPages() {
        let elementsByPage = this.Settings.limit;
        let totalPages = 0;

        if (this.totalElements < elementsByPage) {
            pages = 1;
            return pages;
        }

        totalPages = Math.ceil(this.totalElements / elementsByPage);
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
        let Page = {
            first: data.initItem,
            lastItem: data.lastItem,
            chunck: data.chunck,
            totalItems: data.totalItems,
            page_number: "3 of 3",
            chunks_items: "[21-21]"
        };
        return Page;
    }

    // split data based on metada info
    buildPages() {
        const COUNT_TOTAL_PAGES = this.Metadata.pages;
        // let firstchunck = this.data.splice(1, this.Metadata.elementsByPage);

        let initItem = 0;
        let lastItem = this.Metadata.elementsByPage;

        let chunckAux = [];
        let total = 0;
        let currentPage = 0;
        let cloneArray = structuredClone(this.data);
        // Si haces la operacion en this.data modificas el array original

        // Crea una copia del array this.data
        for (currentPage; currentPage < COUNT_TOTAL_PAGES; currentPage++) {
            chunckAux = cloneArray.slice(initItem, lastItem);
            let obj = this.createPage({
                chunck: chunckAux,
                initItem: initItem + 1,
                lastItem: lastItem,
                totalItems: chunckAux.length
            });
            total = chunckAux.length;
            initItem = lastItem;
            lastItem = lastItem + this.Metadata.elementsByPage;
            this.pagesList.push(obj);
        }
        let tmp = this.pagesList[1];
    }

    dispatchPage(number_page) {
        let index = number_page - 1;
        return this.pagesList[index];
    }
}

//Leemos desde el api o desde el local_storage:
let products = database.products.splice(0, 21);
let paginator = new Paginator({ collection: "products", items: products });
let page = paginator.dispatchPage(3); 
console.log({ ...page });
module.exports = { Paginator };