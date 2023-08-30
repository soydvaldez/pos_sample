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