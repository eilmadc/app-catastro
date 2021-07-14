import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService} from 'src/app/shared/services/authentication-service.ts.service'

@Component({
  selector: 'app-registration',
  templateUrl: './registration.page.html',
  styleUrls: ['./registration.page.scss'],
})
export class RegistrationPage implements OnInit {

  constructor(
    public as: AuthenticationService,
    public route: Router,
  ) { }

  ngOnInit() {
  }

  signUp(email,password){
    this.as.RegisterUser(email.value, password.value).then((rs) =>{
      this.as.SendVerificationMail();
      this.route.navigate(['verify-email']);
      console.log('Registration!!');
    }).catch((error) => {
      window.alert(error.message);
    });
  }

}
