import { Component, OnInit } from '@angular/core';
import { AuthenticationService} from 'src/app/shared/services/authentication-service.ts.service'

@Component({
  selector: 'app-registration',
  templateUrl: './registration.page.html',
  styleUrls: ['./registration.page.scss'],
})
export class RegistrationPage implements OnInit {

  constructor(
    public as: AuthenticationService,
  ) { }

  ngOnInit() {
  }

  signUp(email,password){
    this.as.RegisterUser(email.value, password.value).then((rs) =>{
      console.log('Registration!!');
    }).catch((error) => {
      window.alert(error.message);
    });
  }

}
