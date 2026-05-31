import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonLabel, IonButton, IonInput, IonList} from '@ionic/angular/standalone';
import { Task } from '../models/task.models';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonLabel, IonButton, IonInput, IonList, CommonModule, FormsModule]
})
export class HomePage implements OnInit {

  newTaskStr: string = '';

  tasks: Task[] = [
    {
      id: 1,
      title: "Configuración de Ionic",
      description: "Instalar Node.js, AngularCli, Ionic",
      completed: true,
      priority: "High"
    },
    {
      id: 2,
      title: "Crear app tasklist",
      description: "Crear el proyecto inicial de Ionic con Angular",
      completed: false,
      priority: "Medium"
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

  addTask() {
    console.log(this.newTaskStr);

    const title = this.newTaskStr.trim();

    if (!title) {
      alert('El título no puede estar vacío');
      return;
    }
    const existe = this.tasks.some(
      task => task.title.trim().toLowerCase() === title.toLowerCase()
    );

    if (existe) {
      alert('Ya existe una tarea con ese título');
      return;
    }

    const newTask: Task = {
      id: Date.now(),
      title: title,
      description: '',
      completed: false,
      priority: 'Medium'
    }
    this.tasks.push(newTask);
    this.newTaskStr = '';
    console.log(this.tasks);
  }

}
