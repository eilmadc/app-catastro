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
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import  firebase from 'firebase/app';
import { firebaseConfig } from '../../../environments/firebaseconfig';
import { map} from 'rxjs/operators';




@Injectable({
  providedIn: 'root'
})
export class FcmService {

  tokRef = this.afStore.collection('tokens');

  constructor(private router: Router,
              public afStore: AngularFirestore,
              public ngFireAuth: AngularFireAuth,
              private alertCtrl: AlertController,
              private toastCtrl: ToastController
              ) { }

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
      
      this.presentToast('Token registered:' , token.value);
      console.log(token.value);
      const currentUser = localStorage.getItem('user');
      console.log(token);
      console.log(currentUser);
      this.StorageTokenInCollection(token);

    });

    PushNotifications.addListener('registrationError', (error: any) => {
      //alert('Error on registration: ' + JSON.stringify(error));
      this.presentAlert(error.header, error.message);
    });

    PushNotifications.addListener('pushNotificationReceived',
      (notification: PushNotificationSchema) => {
         //alert('Push received: ' + JSON.stringify(notification));
         //this.presentAlert(notification.title, notification.body);
         this.presentToast(notification.title,  notification.body)
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

  async presentToast(header: string, mes: string) {
    const toast = await this.toastCtrl.create({
      header: header,
      message: mes,
      position: 'middle',
      color: '#0000F0',
      duration: 5000
    });
    toast.present();
  }

  /* Crear token en colección */
  async StorageTokenInCollection(token : Token){
    const anomUser = firebase.auth().signInAnonymously();
    //const tokRef = this.afStore.collection('tokens');

    firebase.auth().signInAnonymously().then((userCredential) => {
      // Signed in
      var user = userCredential.user;
      // ...
      console.log(user);
      this.tokRef.doc(user.uid).set({
        'userId' : user.uid, 
        'token': token.value,
        'createdAt': firebase.firestore.FieldValue.serverTimestamp()
      })
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      // ...
    });

  }

    // if (currentUser.isAnonymous === true) {
    //   console.log("It's anonymous: " + anomUser);
    //   this.tokRef.doc('anoymous').set({
    //     'userId' : 'anonymous',
    //     'token' : token.value
    //   })
    // }
    // else {
    
    // this.tokRef.doc().set({
    //     'userId' : currentUser.uid, 
    //     'token': token.value,
    //     'createdAt': firebase.firestore.FieldValue.serverTimestamp(),
    //     'userEmail': currentUser.email
    //   })
    // } 
  
}
