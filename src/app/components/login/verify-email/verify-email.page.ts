import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { AuthenticationService} from '../../../shared/services/authentication.service'

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.page.html',
  styleUrls: ['./verify-email.page.scss'],
})
export class VerifyEmailPage{

  constructor(
    public as: AuthenticationService,
    private menuCtrl:MenuController
  ) { }

  ionViewWillEnter() {
    this.menuCtrl.enable(false);
    this.menuCtrl.swipeGesture(false);
  }
  verifyEmail(){
    this.as.SendVerificationMail;
  }
}
