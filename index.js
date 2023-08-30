// Enrutador con vanilla javascript 

let ROUTES = [
    { path: '/', resource: 'src/components/products/product-table.html' },
    { path: '/products', resource: 'src/components/products/product-table.html' },
];

// , redirecTo: 'index.html' 
// Pregunta por la ruta

for (let route of ROUTES) {
    if (window.location.pathname === route.path) {
        window.location.pathname = route.resource;
    }
}

// redirect to product-resource: product resource change url value

// Esto  le pides al servidor: /products 
// el servidor internamente sabe que el recurso esta en: src/components/products/product-table.html