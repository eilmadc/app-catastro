import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController, NavController } from '@ionic/angular';
import { AuthenticationService} from '../../shared/services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {

  constructor(
    public as: AuthenticationService,
    public router: Router,
    private menuCtrl: MenuController,
    public navCtrl: NavController,
  ) { }

  ionViewWillEnter() {
    this.menuCtrl.enable(false);
    this.menuCtrl.swipeGesture(false);

  }

  ngOnInit(){
  }
  
/* LOGIN : llamada al método en servicio -> SignIn*/
async signIn(email, password){
  this.as.SignIn(email.value, password.value)
  .then ( (rs) =>{
    if (this.as.isEmailVerified){
      this.router.navigate(['folder/home']);
    }else {
      this.as.toast ('El email no ha sido verificado. Por favor, verifica tu bandeja de entrada','danger')
    }

  }).catch((error) => {
    this.as.toast(error.message, 'danger');
  });
}

/* GOTOSIGNUP: Redirección a la pagina de registro*/
async goToSignUp(){
  this.router.navigate(['login/register']);
}

/* GOOGLEAUTH: Signin con Google Authentication */  
async googleAuth() {
  this.as.GoogleAuth();
}

/* GOTORESETPASSWORD: Redirección a resetpassword page */
async recoverPassword(){
  this.router.navigate(['login/reset-password']);
}


}
