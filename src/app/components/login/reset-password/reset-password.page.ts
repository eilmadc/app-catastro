import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage implements OnInit {

  constructor(
    private as: AuthenticationService,
    private router: Router,
  ) { }

  ngOnInit() {
  }

  /* PASSWORD RECOVER */
  recoverPassword(email){
    console.log(email.value);
    this.as.PasswordRecover(email.value);
  }

  /* IR A LOGIN */
  goToLoginPage(){
    this.router.navigate(['login']);
  }

}
