import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonGrid, IonRow, IonCol, IonCard, IonCardContent, IonImg, IonText, LoadingController } from '@ionic/angular/standalone';
import { SPokemon } from '../../services/pokemon';
import { Router } from '@angular/router';
import { IPokemon } from '../../interfaces/pokemon';

@Component({
  selector: 'app-list-pokemons',
  templateUrl: './list-pokemons.page.html',
  styleUrls: ['./list-pokemons.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonGrid, IonRow, IonCol, IonCard, IonCardContent, IonImg, IonText, CommonModule, FormsModule]
})
export class ListPokemonsPage implements OnInit {

  private pokemonService: SPokemon = inject(SPokemon);
  private router: Router = inject(Router);
  private loadingCtroller: LoadingController = inject(LoadingController);

  //variable para almacenar todos los poquemos en pantalla
  pokemons: IPokemon[] = [];

  constructor() { }

  ngOnInit() {
    this.getMorePokemons();
  }

  async getMorePokemons() {
    //constante para almacenar la promesa
    const promisePokemons = this.pokemonService.getPokemons();

    if (promisePokemons) {//validando que no sea null
      //se crea el controlador para el ion-loading
      const loading = await this.loadingCtroller.create({
        message: 'Cargando...',
      });
      loading.present();//hace que se muestre el loading
      //Se manda llamar la promesa
      promisePokemons.then((pokemons: any) => {
        //El nuevo arreglo de pokemons obtenidos, se
        //concatena con el de la clase interna
        //es decir, los que estaban, mas los nuevos
        this.pokemons = this.pokemons.concat(pokemons);
      })
      .catch((error) => console.log(error))//Si ocurre un error
      .finally(() => {
        //Bloque que se ejecuta al completar o al tener error
        //asegura que el loading cierre
        loading.dismiss();//cierra el loading
      });
    }
  }

  verDetalle(name: string) {
    this.router.navigate(['/detail-pokemon', name]);
  }

  getTypeClass(type: string | undefined): string {
    if (!type) {
      return '';
    }

    return `type-badge type-${type.toLowerCase()}`;
  }

}