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
import { UsersCrudService } from './users-crud.service';
import  firebase from 'firebase/app';
import { AuthenticationService } from './authentication.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';



@Injectable({
  providedIn: 'root'
})
export class FcmService {
  tokRef = this.afStore.collection('tokens');  

  constructor(
              public afStore: AngularFirestore,
              public ngFireAuth: AngularFireAuth,
              private router: Router,
              private alertCtrl: AlertController,
              private toastCtrl: ToastController,
              private auth: AuthenticationService) { }

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
      this.StorageTokenInCollection(token.value);

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
/* Crear token en colección */
async StorageTokenInCollection(token){ 
    // const email = "lisardogayan@gmail.com";
    // const pass = "111111";
    const currentUser = firebase.auth().currentUser;
    if (currentUser !== null) {      
      console.log(currentUser.uid.toString);
      console.log(currentUser.uid);
      console.log(token);
      this.tokRef.doc(token).set({
        'userId' : currentUser.uid.toString,
        'token': token,
        'userEmail': currentUser.email
      })
    }
    else {
      const anomUser = firebase.auth().signInAnonymously();
      console.log(anomUser);
      console.log(anomUser.toString());
      //console.log(currentUser.uid);
      console.log(token);
      this.tokRef.doc(token).set({
        'userId' : anomUser.toString(),
        'token': token,
        'userEmail': ""
      })
    }  
    
    
    //alert('Push registration success, token: ' + token.value);
    console.log('Push registration success, token: ' + token.value);
    // const header = 'Registrado en la aplicación';
    // this.presentAlert (header, token);
    this.presentToast('Token registered:' + token.value);

  }


/* 

async createUserInCollection(user){
  const currentUser = firebase.auth().currentUser;
  this.docRef.doc(currentUser.uid).set({
    'userId' : user.uid,
    'userName': '',
    'userEmail': user.email,
    'userPhone': '',
    'userPhoto': 'assets/User-Icon-Grey.png',
    'createdAt': firebase.firestore.FieldValue.serverTimestamp(),
    'userrol' : 'viewer',
  })
  
}

  const currentUser = firebase.default.auth().currentUser;
  const tokRef = this.afStore.collection('tokens');
  console.log(currentUser.uid.toString);
  console.log(currentUser.uid);
  console.log(token.value);
  tokRef.doc("test").set({
    'userId' : currentUser.uid.toString,
    'token': token,
    'userEmail': currentUser.email
  }) */
  
}
