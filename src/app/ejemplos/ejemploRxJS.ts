import { fromEvent, Observable, of, interval } from 'rxjs';
import { groupBy, map, take, zip } from 'rxjs/operators'

// *** EJEMPLO 1 
// Uso básico de un observable y un observer


// * 1 - Creación de observables
//Creamos una observable que emite valores: 'Hola', 'Federico' y despúes 30
//const observable = of ('Hola', 'Federico', 30);

// * 2 - Creación de Observador

//const observer = {
//    next: (valor: string | number) => console.log(` - ${valor}`),
//    error: (error: any) => console.error(`Error: ${error}`),
//    complete: () => console.info('Hemos terminado')
//}

// * Ejecución del observable => Imprescindible una suscripción

//observable.subscribe(observer);

// *** Ejemplo 2 
// Creación de una función que devuelva un Observable personalizado
export const miObservableDeStrings  = (...args: string[]): Observable<string> => {
    return new Observable((observer) => {
        // Podemos agregar las funciones que queramos.
        if(args.length > 10){
            observer.error('Tiene demasiados argumentos')
        }
        // Para cada uno de los argumentos recibidos por párametro emitimos un valor
        args.forEach((arg: string) => observer.next(arg)); // Emitimos todos los valore que recibamos
        observer.complete(); // Completamos el observer
    })
}

// *** Ejemplo 3 (Observable a partir de eventos)
// Emisión de valores a partir de eventos en el DOM
//Para ello usaremos "fromEvent" de RxJS


// 1. Creamos Observable a partir de "fromeEvent"
//const observableEvent$ = fromEvent(document, 'click'); //Primeros indicamos el target
                                                      //puede ser un componente pero ahora es el DOM,
                                                      // y el tipo de evento, en este caso "click"

// 2. Creación de observer del observable


//observableEvent$.subscribe({
//    next: (valor: Event) => {
//        console.log(`Ha ocurrido un click en: ${valor.type}`)
//    },
//    error: (error: any) => {
//        console.log(`Ha ocurrido un error: ${error}`)
//    },
//    complete: () => {
//        console.info('Terminado observable que escucha el click')
//    }
//})


// *** EJEMPLO 4 (Observable a partir de intervalo con pipe y take)

// * 1. Definimos el observable a partir de un intevalo que emite cada 2 segundos
const observable$ = interval(2000);

// * 2. Creamos el observer que consuma los valores, pero solo se quede con los 3 primeros
observable$.pipe(
    take(3) // Le decimos que solo nos interesan los 3 primeros
).subscribe({
    next: ((valor: number) => console.log(`Valor: ${valor}`)),
    error: ((error: any) => console.error(`Ha ocurrido un error: ${error}`)),
    complete: (() => console.info('Obtenidos los tres primeros valores del intervalo')) 
})

// *** Ejemplo 5 (Uso de operadores: ZIP y MAP)

const timer$ = interval(1000);
const pieces$ = of('', '♞', '', '♞', '♘', '♞');
const columns$ = of('e', 'c', 'g', 'd', 'e', 'f');
const rows$ = of('4', '6', '4', '4', '2', '3');

timer$.pipe(
    zip(   //Combina las observables
        pieces$,
        columns$,
        rows$
    ),
    map(([_, piece, column, row]) => `${piece}${column}${row}`), //Combina las 3 columnas 
    take(3) // Toma solo las primeras 3 primeras emisiones que resultaron de la combinación realizada en map
)

/**
 * Para resumir
 * 1. Se crean 4 observables, la primera es un intervalo que emite datos cada 1 segundo
 *    las otras 3 emiten piezas, columnas y filas.
 * 2. Se toma la observable timer$, que es la de intervablo, y se le aplica un pipe para
 *    aplicarle los operadores zip, map y take.
 * 3. Se le aplica el zip que combina piezas, columnas y filas.
 * 4. El map, toma esa combinación de valor y crea un string y los emite.
 * 5. Take, toma las primeras 3 emisiones que resultan del map y las emite.
 * 
 * Al final solo saldran en pantalla 3 emisiones
 */

// *** Ejemplo 6 (Agrupaciones de valores)

const obsevableGroup$ = interval(1000).pipe(
    groupBy(n => n % 2)
)

// En este caso, el operador groupBy, emite 2 grupos de valor según la sentencia indicada.