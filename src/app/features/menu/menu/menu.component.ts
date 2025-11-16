import { Component } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent {

    menu = {
    entradas: [
      { nombre: "Bruschetta", descripcion: "Pan tostado con tomate, ajo y albahaca.", precio: 8, img: "assets/img/bruschetta.jpg" },
      { nombre: "Ensalada César", descripcion: "Clásica ensalada con pollo y parmesano.", precio: 10, img: "assets/img/cesar.jpg" }
    ],
    platos: [
      { nombre: "Salmón a la plancha", descripcion: "Acompañado de vegetales al vapor.", precio: 18, img: "assets/img/salmon.jpg" },
      { nombre: "Pizza Margarita", descripcion: "Queso mozzarella, tomate y albahaca.", precio: 14, img: "assets/img/pizza.jpg" }
    ],
    bebidas: [
      { nombre: "Limonada natural", descripcion: "Limonada fresca hecha al momento.", precio: 5, img: "assets/img/limonada.jpg" },
      { nombre: "Café espresso", descripcion: "Café fuerte y aromático.", precio: 3, img: "assets/img/cafe.jpg" }
    ]
  };

  

}
