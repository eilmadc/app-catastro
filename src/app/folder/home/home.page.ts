import { Component, OnInit } from '@angular/core';
import {
  ActionPerformed,
  PushNotificationSchema,
  PushNotifications,
  Token,
} from '@capacitor/push-notifications';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  
  constructor(
    private menuCtrl:MenuController,
  ){

  }

  ngOnInit() {
    console.log('Initializing HomePage');
  }

  /* Control del Toggle Menu*/
  ionViewWillEnter() {
    this.menuCtrl.enable(true);
    this.menuCtrl.swipeGesture(true);
    this.ngOnInit();
  }
}
