import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { Platform } from '@ionic/angular';
import { FcmService } from './shared/services/fcm.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages = [
    { title: 'Home', url: './folder/home', icon: 'home' },
    { title: 'Favoritos', url: './folder/favoritos', icon: 'star' },
    { title: 'Mapas', url: './folder/mapas', icon: 'map' },
    { title: 'Listado Inmuebles', url: './folder/listado', icon: 'list' },
    { title: 'Camara', url: './folder/camara', icon: 'camera' },
    { title: 'Web Catastro', url: './folder/webcatastro', icon: 'business' },
    { title: 'Sobre nosotros', url: '/folder/aboutUs', icon: 'information' },
  ];
  //public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];
  constructor(
    //Show/Hide side menu
    public menuCtrl: MenuController,
    private platform: Platform,
    private fcmService: FcmService,
    private router: Router
  ) {
    this.initializeApp();
  }

  openMenu(){
    this.menuCtrl.open();
  }

  closeMenu(){
    this.menuCtrl.close();
  }

  toggleMenu(){
   this.menuCtrl.toggle(); 
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // this.statusBar.styleDefault();
      // this.splashScreen.hide();
 
      // Trigger the push setup 
      this.fcmService.initPush();
    });
  }

  //Ir a PageModule SignOut
  goToSignOut(){
    this.router.navigate(['logout']);
  }

}
