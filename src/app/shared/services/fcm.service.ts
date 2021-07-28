import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core'
import {
  ActionPerformed,
  PushNotificationSchema,
  PushNotifications,
  Token,
} from '@capacitor/push-notifications';
import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';



@Injectable({
  providedIn: 'root'
})
export class FcmService {

  

  constructor(private router: Router,
              private alertCtrl: AlertController,
              private toastCtrl: ToastController) { }

  initPush() {
    if (Capacitor.getPlatform() !== 'web') {
      this.registerPush();
    }
  }
 
  private registerPush() {

    // Request permission to use push notifications
    // iOS will prompt user and return if they granted permission or not
    // Android will just grant without prompting
    PushNotifications.requestPermissions().then(result => {
      if (result.receive === 'granted') {
        // Register with Apple / Google to receive push via APNS/FCM
        PushNotifications.register();
      } else {
        // Show some error
      }
    });

    PushNotifications.addListener('registration', (token: Token) => {
      //alert('Push registration success, token: ' + token.value);
      console.log('Push registration success, token: ' + token.value);
      // const header = 'Registrado en la aplicación';
      // this.presentAlert (header, token);
      this.presentToast('Token registered:' + token.value);
    });

    PushNotifications.addListener('registrationError', (error: any) => {
      //alert('Error on registration: ' + JSON.stringify(error));
      this.presentAlert(error.header, error.message);
    });

    PushNotifications.addListener('pushNotificationReceived',
      (notification: PushNotificationSchema) => {
         //alert('Push received: ' + JSON.stringify(notification));
         this.presentAlert(notification.title, notification.body);
      },
    );

    PushNotifications.addListener(
      'pushNotificationActionPerformed',
      (notification: ActionPerformed) => {
         //alert('Push action performed: ' + JSON.stringify(notification));
         const header = JSON.stringify(notification.actionId);
         const body = "Notificación leida";
         this.presentAlert(header, body);
      },
    );
  }


  async presentAlert (header, message) {
    const alert = await this.alertCtrl.create({
      header,
      message,
      buttons: ['OK']
    });      
  }

  async presentToast(mes: string) {
    const toast = await this.toastCtrl.create({
      message: mes,
      position: 'middle',
      color: '#0000F0',
      duration: 2000
    });
    toast.present();
  }
}
