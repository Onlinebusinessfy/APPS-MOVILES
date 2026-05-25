import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { Task } from '../models/task.models';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class HomePage implements OnInit {

  tasks: Task[] = [
    {
      id: 1,
      titulo: "Configuración de Ionic",
      descripcion: "Instalar Node.js, AngularCli, Ionic",
      finalizado: true,
      proridad: "Alta"
    },
    {
      id: 2,
      titulo: "Crear app tasklist",
      descripcion: "Crear el proyecto inicial de Ionic con Angular",
      finalizado: false,
      proridad: "Media"
    }
  ];

  constructor() { 
    console.log(this.tasks);
  }

  ngOnInit() {
  }

  saludar() {
    console.log("¡Hola, Ionic!");
  }

}
