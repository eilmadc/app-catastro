import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { Router } from '@angular/router';
import { IonicSafeString, IonRouterOutlet, NavController, Platform } from '@ionic/angular';


@Component({
  selector: 'app-logout',
  templateUrl: './logout.page.html',
  styleUrls: ['./logout.page.scss'],
})
export class LogoutPage implements OnInit {
  @ViewChildren(IonRouterOutlet) routerOutlets: QueryList<IonRouterOutlet>;

  constructor(
    private as: AuthenticationService,
    private router: Router,
    private platform: Platform,
    private navController:NavController,
  ) { 
      //this.as.initializeApp();
      this.backButtonEvent();
  }

  ngOnInit() {
  }

  signOut(){
    this.as.SignOut;
  }

  /* Ir a Login */
  goToLoginPage(){
    this.router.navigate(['login']);
  }

  /* Salir de la app */
  exitApp(){
    navigator['app'].exitApp();
  }

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
