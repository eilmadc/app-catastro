import { Component, OnInit } from '@angular/core';
import { AuthenticationService} from '../../../shared/services/authentication-service.ts.service'

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.page.html',
  styleUrls: ['./verify-email.page.scss'],
})
export class VerifyEmailPage implements OnInit {

  constructor(
    public as: AuthenticationService
  ) { }

  ngOnInit() {
  }

}
