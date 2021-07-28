import { Injectable, NgZone } from '@angular/core';
import  firebase from 'firebase/app';
import { User , Roles, UserExtended} from "../interfaces/user";
import { Router } from "@angular/router";
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { firebaseConfig } from 'src/environments/firebaseconfig';
import { ToastController } from '@ionic/angular';


@Injectable({
  providedIn: 'root'
})
export class UsersCrudService {
  userData: any;
  user$:UserExtended;
  docRef = this.afStore.collection('users');

  constructor(
    public afStore: AngularFirestore,
    public ngFireAuth: AngularFireAuth,
    public router: Router,  
    public ngZone: NgZone ,
    private toastr: ToastController
  ) { }

/* Crear usuario en colección */
async createUserInCollection(user){
  const currentUser = firebase.auth().currentUser;
  console.log(firebase.firestore.FieldValue.serverTimestamp());
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

  /* Obtener datos de la colección en Firebase*/
  async getUserFromCollection(){
    const currentUser = firebase.auth().currentUser;
    console.log(currentUser);
    return currentUser;
  }

    /* Actualizar información del usuario */
    async updateUserInCollection(username,userphone,userrol){
      const currentUser = firebase.auth().currentUser;
      this.docRef.doc(currentUser.uid).set({
        'userName': username,
        'userPhone': userphone,
        'userrol' : userrol,
      })
      console.log('Current User: ',currentUser);
    }

  //Metodo para envío de mensajes Toast.
  async toast(mensaje,status)
  {
    const toast = await this.toastr.create({
      message: mensaje,
      color:status,
      position: 'top',
      duration: 2000
    });
    toast.present();
  }

}
