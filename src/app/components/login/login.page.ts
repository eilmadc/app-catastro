import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService} from '../../shared/services/authentication.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(
    public as: AuthenticationService,
    public router: Router
  ) { }

  ngOnInit() {
  }
  
/* LOGIN : llamada al método en servicio -> SignIn*/
signIn(email, password){
  this.as.SignIn(email.value, password.value).then ((rs) =>{
    if (this.as.isEmailVerified){
      this.router.navigate(['folder/home']);
    } else { 
      window.alert('El email introducido no es correcto');
      return false;
    }
  }).catch((error) => {
    window.alert(error.message);
  });
}

/* GOTOSIGNUP: Redirección a la pagina de registro*/
goToSignUp(){
  this.router.navigate(['login/register']);
}

/* GOOGLEAUTH: Signin con Google Authentication */  
googleAuth() {
  this.as.GoogleAuth();
}

/* GOTORESETPASSWORD: Redirección a resetpassword page */
recoverPassword(){
  this.router.navigate(['login/reset-password']);
}

}
