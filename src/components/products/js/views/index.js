"use strict";
import { ProductRepository } from '../data/product.repository.js';
import { CustomController } from './product.controller.js';
import { PaginatorController } from './paginator.controller.js';
import { Paginator } from '../paginator.table.js';

// Ambos controladores tienen la capacidad de emitir y reaccionar a eventos nativos o customizados
// Tambien tiene la capacidad de mutar el estado y la estructura de elementos HTML
let repository = new ProductRepository();

//Aqui estoy dependiendo del repositorio para continuar
// var globalTable = document.querySelector('table');
// console.log({ globalTable });

//Global references:
window.table = document.querySelector('table');

// async response
repository.listar((products) => {
    // Datos del modulo
    let collection = { collection: "products", items: products };
    let settings = { limit: 5, orderBy: 'asc' };

    new Paginator(collection, settings);
    new CustomController(repository);
    new PaginatorController();
});

