import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/shared/services/authentication-service.ts.service';
import { Router } from '@angular/router';
import { IonicSafeString } from '@ionic/angular';


@Component({
  selector: 'app-logout',
  templateUrl: './logout.page.html',
  styleUrls: ['./logout.page.scss'],
})
export class LogoutPage implements OnInit {

  constructor(
    private as: AuthenticationService,
    private router: Router,
  ) { }

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

}
