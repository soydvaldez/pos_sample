// Enrutador with vanilla javascript 

let ROUTES = [
    { path: '/', value: 'product-table.html' },
    { path: '/home', value: 'product-table.html' },
];

// Pregunta por la ruta
for (let route of ROUTES) {
    if (window.location.pathname === route.path) {
        window.location.pathname = route.value;
    }
}


// window.location.href = '/index.html';