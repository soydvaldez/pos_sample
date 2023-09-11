"use strict";
// Clase para controlar el componente del paginador
import { Paginator } from '../paginator.table.js';

class PaginatorController {
    data = [];
    paginator = undefined;

    constructor() {
        window.table.dispatchEvent(new CustomEvent('render_page', {
            bubbles: true,
            detail: { nombre: 'render_page', target: 'componentA' }
        }));


        // referencia al contenedor del componente:
        this.paginatorComponentUI = document.querySelector('.wrapper-paginator');

        this.paginatorComponentUI.addEventListener('render', (e) => {
            console.log('redefff');
        });

        let handlerPaginator = (event) => {
            event.target.dispatchEvent(new CustomEvent('render'));


            let target = event.target;
            if (target.tagName === "BUTTON") {
                // let element = event.target;
                let action = target.getAttribute('action');
                // { component: control, type: 'paginator_component' }
                // Aqui debo controlar el comportamiento de la tabla
                switch (action) {
                    case "step-backward":
                        console.log('step-backward');
                        // Este accion mutara el estado de la tabla renderizando una pagina:
                        // Este componente producira un estado talvez y pueda propagaro
                        event.target.dispatchEvent(new CustomEvent('hola_mundo', {
                            bubbles: true,
                            detail: { text: () => textarea.value },
                        }));

                        document.querySelector('tbody').dispatchEvent(
                            new CustomEvent('render_page', {
                                bubbles: true,
                                detail: { type: event, nombre: 'render_page', target: 'componentA' }
                            })
                        );

                        break;
                    case "backward":
                        console.log('backward');
                        break;
                    case "forward":
                        console.log('forward');
                        break;
                    case "step-forward":
                        console.log('step-forward');
                        break;
                }
            }
        };

        this.paginatorComponentUI.addEventListener('click', handlerPaginator);
    }

    loadAsyncData() {

    }
}
// new PaginatorController();
export { PaginatorController }

