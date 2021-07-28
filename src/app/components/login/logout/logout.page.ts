import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { Router } from '@angular/router';
import { IonicSafeString, IonRouterOutlet, MenuController, NavController, Platform } from '@ionic/angular';


@Component({
  selector: 'app-logout',
  templateUrl: './logout.page.html',
  styleUrls: ['./logout.page.scss'],
})
export class LogoutPage {
  @ViewChildren(IonRouterOutlet) routerOutlets: QueryList<IonRouterOutlet>;

  constructor(
    private as: AuthenticationService,
    private router: Router,
    private platform: Platform,
    private menuCtrl:MenuController,
    private navController:NavController,
  ) { 
      this.backButtonEvent();
  }

  ionViewWillEnter() {
    this.menuCtrl.enable(false);
    this.menuCtrl.swipeGesture(false);
  }

  signOut(){
    this.as.SignOut();
  }

  /* Ir a Login */
  goToLoginPage(){
    this.router.navigate(['login']);
  }

  /*TODO: Salir de la app */
  backButtonEvent() {
    this.platform.backButton.subscribe(async () => {

        this.routerOutlets.forEach((outlet: IonRouterOutlet) => {
            if (outlet && outlet.canGoBack()) {
                outlet.pop();
            } else  {
                 navigator['app'].exitApp();
            }
        });
    });
}

}
