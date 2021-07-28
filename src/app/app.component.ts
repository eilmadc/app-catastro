import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { Platform } from '@ionic/angular';
import { AuthenticationService } from './shared/services/authentication.service';
import { FcmService } from './shared/services/fcm.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  userInfo: any;

  public appPages = [
    { title: 'Home', url: './folder/home', icon: 'home' },
    { title: 'Favoritos', url: './folder/favoritos', icon: 'star' },
    { title: 'Mapas', url: './folder/mapas', icon: 'map' },
    { title: 'Listado Inmuebles', url: './folder/listado', icon: 'list' },
    { title: 'Camara', url: './folder/camara', icon: 'camera' },
    { title: 'Web Catastro', url: './folder/webcatastro', icon: 'business' },
    { title: 'Sobre nosotros', url: '/folder/aboutus', icon: 'information' },
    { title: 'Mi Cuenta', url: '/folder/micuenta', icon: 'person' },
    
  ];
  
  constructor(
    //Show/Hide side menu
    public menuCtrl: MenuController,
    private platform: Platform,
    private fcmService: FcmService,
    private router: Router,
    private as: AuthenticationService,
  ) {
    this.initializeApp();
  }

  ionDidViewDidEnter(){}

  openMenu(){
    this.menuCtrl.open();
    //this.getCurrentUser();
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
  async goToSignOut(){
    this.router.navigate(['logout']);
  }


}
