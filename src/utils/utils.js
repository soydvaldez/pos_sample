// let require();

function tmp() {
    //paginar elementos:
    let pages = parseInt(this.data$.length / limit);
    // console.log({ pages, withElements: limit });

    let iterator = this.crearIterador(['a', 'b', 'c', 'd', 'z']);

    let aux = undefined;
    let increment = 0;
    do {
        aux = iterator.next();
        console.log(aux.value);
    } while (aux.hasNext);
    // Si el valor es undefined no ejecutes el ciclo

    var miIterable = {};
    miIterable[Symbol.iterator] = function* () {
        // Yield es una palabra clave para pausar o reanudar el iterator
        // yield devuelve el resultado de la evaluacion
        yield 1 == 1 ? true : false;
        yield 1 == 1 ? false : true;
        yield 1 == 1 ? true : false;
    };

    for (let valor of miIterable) {
        console.log(valor);
    }

    // 
    function crearIterador(arreglo) {
        var siguienteIndice = 0;
        // El objeto devuelto mantiene su estado es por eso que se puede pausar o reanudar
        return {
            next: function () {
                return siguienteIndice < arreglo.length
                    ? {
                        value: arreglo[siguienteIndice++],
                        hasNext: true
                    } : {
                        hasNext: false
                    };
            }
        };
    }
}

// Genera la metada para poder crear un paginador
// Formulas:
// paginas = total_elements/limit
// 

function settingsPaginator() {
    let collection = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    let settings = { limit: 10, orderBy: 'asc' };

    let elememtsByPage = settings.limit;
    // let pages = ;


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
        // console.log('Hay elementos restantes');
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