// Clase para controlar el componente del paginador
import { Paginator } from '../paginator.table.js';

class PaginatorController {
    constructor() {
        // referencia al contenedor del componente:
        this.paginatorUI = document.querySelector('.wrapper-paginator');

        let handlerBackward = (event) => {
            if (event.target.tagName === "BUTTON") {
                let element = event.target;
                let action = element.getAttribute('action');
                console.log(action);
                switch (action) {
                    case "step-backward":
                        console.log('step-backward');
                        break;
                    case "backward":
                        console.log('backward');
                        break;
                    case "forward":
                        console.log('forward');
                        break;
                    case "step-forward":
                        alert('step-forward');
                        break;
                }
            }

        };

        this.paginatorUI.addEventListener('click', handlerBackward);

        // Efecto burbuja:
    }
}
new PaginatorController();
// PaginatorController

