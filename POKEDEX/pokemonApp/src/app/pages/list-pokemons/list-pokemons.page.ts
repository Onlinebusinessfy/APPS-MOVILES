import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonGrid, IonRow, IonCol, IonCard, IonCardContent, IonImg, IonText, IonInfiniteScroll, IonInfiniteScrollContent, LoadingController, InfiniteScrollCustomEvent } from '@ionic/angular/standalone';
import { SPokemon } from '../../services/pokemon';
import { Router } from '@angular/router';
import { IPokemon } from '../../interfaces/pokemon';

@Component({
  selector: 'app-list-pokemons',
  templateUrl: './list-pokemons.page.html',
  styleUrls: ['./list-pokemons.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonGrid, IonRow, IonCol, IonCard, IonCardContent, IonImg, IonText, IonInfiniteScroll, IonInfiniteScrollContent, CommonModule, FormsModule]
})
export class ListPokemonsPage implements OnInit {

  private pokemonService: SPokemon = inject(SPokemon);
  //Inyección de la dependencia, no olvidar importarlo
  private loadingCtroller: LoadingController = inject(LoadingController);
  
  //Inyectar la dependencia
  private router: Router = inject(Router);

  //variable para almacenar todos los poquemos en pantalla
  pokemons: IPokemon[] = [];
  isLoading = false;
  hasMorePokemons = true;

  constructor() { }

  goToPage(pokemon: IPokemon) {
    this.router.navigate(['/detail-pokemon', pokemon.id]);
  }

  ngOnInit() {
    this.pokemonService.resetPagination();
    void this.getMorePokemons();
  }

  async getMorePokemons(event?: InfiniteScrollCustomEvent) {
    if (this.isLoading || !this.hasMorePokemons) {
      return;
    }

    this.isLoading = true;

    let loading: any;

    if (!event) {
      loading = await this.loadingCtroller.create({
        message: 'Cargando...'
      });
      await loading.present();
    }

    try {
      const pokemons = await this.pokemonService.getPokemons();

      if (pokemons.length > 0) {
        this.pokemons = this.pokemons.concat(pokemons);
      }

      this.hasMorePokemons = this.pokemonService.hasMorePokemons;
    } catch (error) {
      console.log(error);
    } finally {
      if (event) {
        event.target.complete();
        if (!this.hasMorePokemons) {
          event.target.disabled = true;
        }
      } else if (loading) {
        await loading.dismiss();
      }

      this.isLoading = false;
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