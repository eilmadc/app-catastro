import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService} from '../../shared/services/authentication-service.ts.service';
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
  
/* LOGIN : call to method in service -> SignIn*/
signIn(email, password){
  this.as.SignIn(email.value, password.value).then ((rs) =>{
    if (this.as.isEmailVerified){
      this.router.navigate(['folder/home']);
    } else { 
      window.alert('Your email signin is not correct ');
      return false;
    }
  }).catch((error) => {
    window.alert(error.message);
  });
}

/* GOTOSIGNUP: redirect to registration page*/
goToSignUp(){
  this.router.navigate(['login/registration']);
}

/* GOOGLEAUTH: signin with Google Authentication */  
googleAuth() {
  this.as.GoogleAuth();
}
}
