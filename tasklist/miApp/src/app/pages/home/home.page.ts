import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonLabel, IonButton, IonInput, IonList, IonIcon, IonItemSliding, IonItemOptions, IonItemOption, IonReorder, IonReorderGroup } from '@ionic/angular/standalone';
import { Task } from '../../models/task.models';
import { inject, Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular/standalone';
import { Preferences } from '@capacitor/preferences';
import { ReorderEndCustomEvent } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { addCircleOutline, trashOutline } from 'ionicons/icons';

@Injectable({
  providedIn: 'root'
})

export class Alert {
  
  private alertController: AlertController = inject(AlertController);

  async showAlert(headerText:string, messageText:string) {
    const alert = await this.alertController.create({
      header: headerText,
      message: messageText,
      buttons: ['OK'],
    });

    await alert.present();
  }

  async confirmAlert (
    header: string,
    message: string,
    funcionOK: Function,
    cancelText: string = 'Cancelar',
    confirmText: string = 'Aceptar'
    ){
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: [
        {
          text: cancelText,
          role: 'cancel',
        },
        {
          text: confirmText,
          role: 'confirm',
          handler: () => {
            funcionOK();
          }
        }
      ],
    });
    
    await alert.present();
  }
}

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonLabel, IonButton, IonInput, IonList, IonIcon, IonItemSliding, IonItemOptions, IonItemOption, IonReorder, IonReorderGroup, CommonModule, FormsModule]
})

export class HomePage implements OnInit {
  
  newTaskStr: string = '';
  private readonly KEY_TASK = 'local_key_task';

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

  public alertService: Alert = inject(Alert);

  constructor() { 
    addIcons({
    addCircleOutline,
    trashOutline
    });
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

    this.alertService.showAlert('Éxito', 'Tarea agregada');
    this.tasks.push(newTask);
    this.saveTaskOnLocal();
    this.newTaskStr = '';
    console.log(this.tasks);
  }

  confirmDelete(task: Task) {
    this.alertService.confirmAlert(
      'Aviso',
      `Deseas borrar la tarea "${task.title}"?`,
      () => this.deleteTask(task),
      'NO',
      'SI'
    );
  }

  deleteTask(task: Task) {
  const index = this.tasks.findIndex(t => t.id === task.id);

    if (index !== -1) {
      this.tasks.splice(index, 1);
      this.saveTaskOnLocal();
    }
  }

  actualizarPosiciones(event:ReorderEndCustomEvent) {
    console.log("El arreglo antes del cambio: ", this.tasks);
    this.tasks = event.detail.complete(this.tasks);
    this.saveTaskOnLocal();
    console.log("El arreglo después del cambio: ", this.tasks);
  }

  async ionViewWillEnter() {
    const taskPrefences = await Preferences.get({ key: this.KEY_TASK });

    if (taskPrefences.value) {
      const tasks = JSON.parse(taskPrefences.value);
      if (Array.isArray(tasks)) {
        this.tasks = tasks;
      }
    }
  }

  saveTaskOnLocal(){
    Preferences.set(
      {
      key: this.KEY_TASK,
      value: JSON.stringify(this.tasks)
      }
    );
  }
}
