// monitorea al objeto window

window.addEventListener('resize', (e) => {
    console.log(e.target);
    let height = window.innerHeight;
    let width = window.innerWidth;

    console.log(height, width);

    if (width <= 500) {
        document.body.style.backgroundColor = "yellow";
    }
    
    if (width > 500) {
        document.body.style.backgroundColor = "rgb(255, 255, 255)";
    }
});

let data_funko = [];

let selectedRow = undefined;
HEADERS = ['id', 'nombre', 'descripcion', 'precio_compra',
    'precio_venta', 'cantidad', 'categoria',
    'subcategoria',
    'iva',
    'porcentaje_utilidad', 'codigo_barras'];

let body = document.body;
let input = body.querySelector('input');

let TABLE = document.querySelector('table');
let TBODY = document.querySelector('tbody');
let trIronman = TBODY.querySelector('.ironman');

// Id del objeto y posicion, al ultimo renderizas el formulario.
let form = document.querySelector('.form_products');
let div = document.querySelector('.form-detail-product__footer');



let editDescripcion = form['descripcion'];
let code = [];
let timer = undefined;


body.addEventListener('input', (e) => {
    //Si existe un timer cancelalo y crea uno nuevo
    if (timer) {
        clearInterval(timer);
    }

    timer = setTimeout(() => {
        console.log('leyendo...');
        // Si dejas que concluya el timer emite un evento:
        editDescripcion.dispatchEvent(new CustomEvent("change"));
        // editDescripcion.value = "";
        clearInterval(timer);
    }, 500);
});

body.addEventListener('change', (e) => {
    console.log('Termino de leer');
    console.log(e.target.value);
    editDescripcion.innerText = "";
    editDescripcion.value = e.target.value;
});



let handlerAmountTotal = () => { }

let handlerNotification = () => {
    let activate = false;
    let msg_notification = document.getElementById('msg_notification');
    let icon = document.querySelector('.notification_hidden div i');

    return {
        // Establece un escucha
        listenersNotification() {
            icon.addEventListener('click', (e) => {
                // Si despues de 15 segundo sigue renderizado el componente borralo:

                this.renderMessageUpdated();
                // msg_notification.setAttribute('class', 'notification_hidden');
            });
        },
        renderMessageUpdated() {
            activate = !activate;
            if (activate) {
                msg_notification.setAttribute('class', 'notification_display');
                return;
            } else {
                msg_notification.setAttribute('class', 'notification_hidden');
                return
            }
        }
    }
}

// Manejador de eventos:
let handler = handlerNotification();
handler.listenersNotification();

// Programacion asyncrona a futuro:
form.addEventListener('submit', (e) => {
    e.preventDefault();
    let data = Object.fromEntries(new FormData(e.target));
    console.log(data);
    handler.renderMessageUpdated();
    // form.reset();
    let inputNombre = e.target['nombre'];
    let inputDateTime = e.target['nombre'];
    let inputDescripcion = e.target['descripcion'];
    let inputPrecio = e.target['precio'];
    let inputPrecioVenta = e.target['precio_venta'];
    let inputStock = e.target['stock'];


    inputNombre.style.border = "2px solid blue";
    inputDescripcion.style.border = "2px solid blue";
    inputPrecio.style.border = "2px solid blue";
    inputPrecioVenta.style.border = "2px solid blue";
    inputStock.style.border = "2px solid blue";

    setTimeout(() => {
        inputNombre.style.border = "1px solid #ccc";
        inputDescripcion.style.border = "1px solid #ccc";
        inputPrecio.style.border = "1px solid #ccc";
        inputPrecioVenta.style.border = "1px solid #ccc";
        inputStock.style.border = "1px solid #ccc";
    }, 5000);
});

TBODY.addEventListener('mouseover', (e) => {
    let elementHTLM = getElementHTML(e);
    if (elementHTLM.tagName === "TD") {
        let row = getParent(elementHTLM);
        row.setAttribute('class', 'row-style');
    }
});

TBODY.addEventListener('mouseout', (e) => {
    let elementHTLM = getElementHTML(e);
    if (elementHTLM.tagName === "TD") {
        let row = getParent(elementHTLM);
        row.removeAttribute('class');
    }
});


TBODY.addEventListener('click', (e) => {
    // e.stopPropagation();
    e.preventDefault();
    let elementHTML = e.target;

    let tdElement = undefined;
    let rowElement = undefined;

    // Si haces click sobre TD solo subes un nivel:
    if (elementHTML.tagName === "I" || elementHTML.tagName === "TD") {
        if (elementHTML.tagName === "I") {
            tdElement = getParent(elementHTML);
            rowElement = getParent(tdElement);
        } else {
            rowElement = getParent(elementHTML);
        }

        let data = extractRowData(rowElement);
        selectedRow = data;
        inyectDataToForm();
    }
});

// Que el contorno de los inputs cambien de color momentanemanete:


function getParent(elementHMTL) {
    return elementHMTL.parentNode;
}

function getElementHTML(e) {
    return e.target;
}

function extractRowData(row) {
    //Estado original: Extrae los datos de las celdas de una fila y lo convierte en un objeto
    let values = row.children;
    let selectedRow = {};

    for (let key of HEADERS) {
        if (!values[key] || !values[key] === undefined) {
            continue;
        }
        selectedRow[key] = values[key].innerText;
    }
    return selectedRow;
}

function inyectDataToForm() {
    if (!selectedRow) {
        return 'no data available';
    }

    let editId = form['id'];
    let editNombre = form['nombre'];
    let editCategoria = form['categoria'];
    let editSubcategoria = form['subcategoria'];
    let editFechaActualizacion = form['fecha_actualizacion'];
    let editDescripcion = form['descripcion'];
    let editPrecio = form['precio_venta'];
    // let editDivisa = form['divisa'];
    let editCantidad = form['cantidad'];

    editNombre.value = selectedRow.nombre;
    editDescripcion.value = selectedRow.descripcion;
    editPrecio.value = selectedRow.precio_venta;
    // editDivisa.value = selectedRow.divisa;
    editCantidad.value = selectedRow.cantidad;
    editFechaActualizacion.value = moment().format('YYYY-MM-DDTHH:mm:ss');

    setInterval(() => {
        // Muta el estado cada 1  segundo
        editFechaActualizacion.value = moment().format('YYYY-MM-DDTHH:mm:ss');
    }, 1000);

    editNombre.classList.add('selectedRowItem');
    editCategoria.classList.add('selectedRowItem');
    editSubcategoria.classList.add('selectedRowItem');
    editDescripcion.classList.add('selectedRowItem');
    editPrecio.classList.add('selectedRowItem');
    editCantidad.classList.add('selectedRowItem');

    setTimeout(() => {
        editNombre.classList.remove('selectedRowItem');
        editCategoria.classList.remove('selectedRowItem');
        editSubcategoria.classList.remove('selectedRowItem');
        editDescripcion.classList.remove('selectedRowItem');
        editPrecio.classList.remove('selectedRowItem');
        editCantidad.classList.remove('selectedRowItem');
    }, 3000);

}

function test() {
    let row5 = document.querySelector('.simulate-action');
    row5.dispatchEvent(new Event('click', { bubbles: true }));
}

test();

// input.dispatchEvent(new Event('submit'));
// Si dan click sobre otra fila quitar el efecto y volver a iniciarlo


// Formula para calcular el costo de un producto: CostoTotal/pza * utilidad * IVA

// Calcular el costo por pza
// 50/40 = 1.25 pza

// Calcular la utilidad por pza
// 1.25 * 0.5 = 0.625 + 1.25 = 1.875
// 1.25 * 1.5 = 1.875

// IVA por PZA
// 1.25 * 0.16 = 0.2
// Precio de venta = 2.075 o redondealo a 2 pesos
