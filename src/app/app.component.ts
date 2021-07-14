import { Component } from '@angular/core';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages = [
    { title: 'Home', url: './folder/home', icon: 'home' },
    { title: 'Mapas', url: './folder/mapas', icon: 'map' },
    { title: 'Listado Inmuebles', url: './folder/listado', icon: 'list' },
    { title: 'Buscar', url: './folder/consultas', icon: 'search' },
    { title: 'Camara', url: './folder/camara', icon: 'camera' },
    { title: 'Sobre nosotros', url: '/folder/aboutUs', icon: 'information' },
  ];
  //public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];
  constructor(
    //Show/Hide side menu
    public menuCtrl: MenuController
  ) {}

  openMenu(){
    this.menuCtrl.open();
  }

  closeMenu(){
    this.menuCtrl.close();
  }

  toggleMenu(){
   this.menuCtrl.toggle(); 
  }

}
