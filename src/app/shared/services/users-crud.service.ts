import { Injectable, NgZone } from '@angular/core';
import  firebase from 'firebase/app';
import { User } from "../interfaces/user";
import { Router } from "@angular/router";
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore } from '@angular/fire/firestore';
import { firebaseConfig } from '../../../environments/firebaseconfig';
import { ToastController } from '@ionic/angular';
import { map} from 'rxjs/operators';
import { Token } from '@capacitor/push-notifications';


@Injectable({
  providedIn: 'root'
})
export class UsersCrudService {
  userData: any;
  docRef = this.afStore.collection('users');
  tokRef = this.afStore.collection('tokens');

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

  /*READ: Obtener datos del usuario de Firebase*/
  async getUserInfoFromCollection(){
    const currentUser = firebase.auth().currentUser;
    return this.docRef.doc(currentUser.uid).valueChanges();    
  }

  /* UPLOAD: Actualizar información del usuario */
    async updateUserInCollection(username,userphone,userrol){
      const currentUser = firebase.auth().currentUser;
      console.log(currentUser)
      this.docRef.doc(currentUser.uid).update({
        'userName': username,
        'userPhone': userphone,
        'userrol' : userrol,
      })
      console.log('Current User: ',currentUser);
    }

/* DELETE: Borrar el usuario de la colección y Firebase */
delete ( id ){
  this.afStore.doc('users/'+ id).delete();
  const currentUser = firebase.auth().currentUser;
  currentUser.delete().then(()=>{
    this.toast("Usuario borrado de la app.", "warning");
    this.router.navigate(['login']);
  }).catch((error) => {
    this.toast(error, "danger");
  });
}
  /**
   * Metodo para mostrar mensajes pasados por parametros en un Toast
   * @param mensaje 
   * @param status 
   */
  async toast(mensaje,status)
  {
    const toast = await this.toastr.create({
      message: mensaje,
      color:status,
      position: 'top',
      duration: 1000
    });
    toast.present();
  }


  /* Crear token en colección */
  async StorageTokenInCollection(token : Token){
    const currentUser = firebase.auth().currentUser;
    const tokRef = this.afStore.collection('tokens');
    this.tokRef.doc(currentUser.uid).set({
      'userId' : currentUser.uid, 
      'token': token.value,
      'createdAt': firebase.firestore.FieldValue.serverTimestamp(),
      'userEmail': currentUser.email
    })
  }
}
