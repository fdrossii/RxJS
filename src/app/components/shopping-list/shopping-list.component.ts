import { Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import { miObservableDeStrings } from 'src/app/ejemplos/ejemploRxJS';
import { ShoppingService } from 'src/app/services/shopping.service';
import { Product } from 'src/app/types/product.type';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit, OnDestroy {

  shoppingList: Product [] = [];
  subscription: Subscription = new Subscription();

  //Estan solo de ejemplo para mostrar la diferencia
  //subject no tiene valor inicial, behaviorSubject si.
  subject$: Subject<string> = new Subject();
  behaviorSubject: BehaviorSubject<string> = new BehaviorSubject('Holanda'); 

  constructor(private shoppingService: ShoppingService){

  }

  
  /**
   * * next => Atributo obligatorio de cualquier observer; funcionalidad que recibe
   *   del observable al emitir nuevos valores.
   * 
   * * error => funcionalidad que gestiona las notificaciones de error que puede 
   *   lanzar el observable
   * 
   *  * completed => funcionalidad opcional que gestiona las notificaciones
   *    de una ejecución completada
   */

  ngOnInit(): void {

    //Esta es correcta pero no la recomenada
    
    /*

    this.subscription = this.shoppingService.getAllProducts().subscribe(
    next   (list: Product[]) =>{
        this.shoppingList = list;
      }),
    error    ((error: any)=> console.error(`Ha ocurrido un error al obtener la lista: ${error}`))
    complete (()=> console.info(`Obtención de lista de productos completada`))
    */

    // La forma correcta, o recomendad, de hacer la subscripción es la siguiente
        
    this.subscription = this.shoppingService.getAllProducts().subscribe(
      {
        next: (list: Product[]) =>{
        this.shoppingList = list;
        console.table(this.shoppingList);
        },
        error: (error: any) => {
          console.error(`Ha ocurrido un error al obtener la lista: ${error}`);
        },
        complete: () => {
          console.info(`Obtención de lista de productos completada`);
        }
      }
    )

    // * Ejemplo de recepción de diferentes valores
    this.subscription.add( this.shoppingService.getUserData().subscribe({
      next: (valor: string | number) => console.log(` - ${valor}`),
      error: (error: any) => console.error(`Error: ${error}`),
      complete: () => console.info('Hemos terminado')
      }));

    // * Ejemplo de uso de un Observable personalizado
    miObservableDeStrings('Hola', 'Fede', 'que', 'tal?').subscribe({
      next: (valor: string) => console.log(`- ${valor}`),
      error: (error) => console.error(`Ha habido un error: ${error}`),
      complete: () => console.log('Fin de emision de observable personalizado')
    });

    // * Ejemplo de captura de clicks en el documento a través de un Observable
    this.shoppingService.getClicks().subscribe(
      { 
        next: (valor: Event) => { console.log(`Ha ocurrido un click en: ${valor.target}`) },
        error: (error: any) => { console.log(`Ha ocurrido un error: ${error}`) },
        complete: () => { console.info('Terminado observable que escucha el click') }}
    )

  }



  ngOnDestroy(): void {
    // Desuscribimos cuando el componente desaparece
    this.subscription.unsubscribe();
  }
}
