import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  LoadingController,
  IonFab,
  IonFabButton,
  IonIcon,
  IonProgressBar,
  IonImg,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonText
} from '@ionic/angular/standalone';
import { SPokemon } from 'src/app/services/pokemon';
import { IPokemon } from 'src/app/interfaces/pokemon';
import { addIcons } from 'ionicons';
import { closeOutline } from 'ionicons/icons';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-detail-pokemon',
  templateUrl: './detail-pokemon.page.html',
  styleUrls: ['./detail-pokemon.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,

    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,

    IonFab,
    IonFabButton,
    IonIcon,

    IonGrid,
    IonRow,
    IonCol,

    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,

    IonText,
    IonImg,
    IonProgressBar
  ]
})
export class DetailPokemonPage implements OnInit {

  private servicioPokemon: SPokemon = inject(SPokemon);
  private loadingController: LoadingController = inject(LoadingController);
  private router: Router = inject(Router);
  private route: ActivatedRoute = inject(ActivatedRoute);

  pokemon?: IPokemon;

  constructor() {
    addIcons({
      closeOutline
    });
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.goBack();
      return;
    }

    void this.loadPokemon(Number(id));
  }

  async loadPokemon(id: number) {
    const loading = await this.loadingController.create({
      message: 'Cargando...'
    });

    await loading.present();

    try {
      this.pokemon = await this.servicioPokemon.getPokemon(id);
    } finally {
      await loading.dismiss();
    }
  }

  goBack() {
    this.router.navigate(['/list-pokemons']);
  }

  getTypeClass(type: string | undefined): string {
    if (!type) {
      return '';
    }

    return `type-badge type-${type.toLowerCase()}`;
  }

  toNumber(value: number | string | undefined): number {
    return Number(value || 0);
  }
}
