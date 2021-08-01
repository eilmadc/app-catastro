import { Injectable, NgZone } from '@angular/core';
import  firebase from 'firebase/app';
import  auth from 'firebase/app';
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
  currentUser;

  constructor(
    public afStore: AngularFirestore,
    public ngFireAuth: AngularFireAuth,
    public router: Router,  
    public ngZone: NgZone ,
    private toastr: ToastController
  ) { }

   ionViewDidEnter(){
   }


/* Crear usuario en colección */
async createUserInCollection(user){
  this.docRef.doc(firebase.auth().currentUser.uid).set({
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
    console.log(this.currentUser);
    return this.currentUser;
  }

  /*READ: Obtener datos del usuario de Firebase*/
  async getUserInfoFromCollection(){
    console.log(firebase.auth().currentUser.uid);
    return  await this.docRef.doc(firebase.auth().currentUser.uid).valueChanges();    
  }

  /* UPLOAD: Actualizar información del usuario */
    async updateUserInCollection(username,userphone,userrol){
      //const currentUser = firebase.auth().currentUser;
      this.docRef.doc(firebase.auth().currentUser.uid).update({
        'userName': username,
        'userPhone': userphone,
        'userrol' : userrol,
      })
      this.toast("Cambios guardados", 'warning');
    }

/* DELETE: Borrar el usuario de la colección y Firebase */
delete ( id ){
  
  const fbCurrentUser = firebase.auth().currentUser;
  fbCurrentUser.delete().then(()=>{
    this.docRef.doc(fbCurrentUser.uid).delete();
    //this.afStore.doc('users/'+ id).delete();
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
      duration: 2000,
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
