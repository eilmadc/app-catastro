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

export class AuthenticationService {
  userData: any;
  user$:UserExtended;

  constructor(
    public afStore: AngularFirestore,
    public ngFireAuth: AngularFireAuth,
    public router: Router,  
    public ngZone: NgZone ,
    private toastr: ToastController
  ) {
    this.ngFireAuth.authState.subscribe(user => {
      if (user) {
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(this.userData));
        JSON.parse(localStorage.getItem('user'));
      } else {
        localStorage.setItem('user', null);
        JSON.parse(localStorage.getItem('user'));
      }
    })
  }

  /* Login con email/password */
  async SignIn(email, password) {
    return this.ngFireAuth.signInWithEmailAndPassword(email, password)
  }

  /* Registro con email/password */
  async RegisterUser(email, password) {
    return this.ngFireAuth.createUserWithEmailAndPassword(email, password)
  }

  /* Verificación de email cuando un nuevo usuario se registra */
  async SendVerificationMail() {
    return this.ngFireAuth.currentUser.then(e => e.sendEmailVerification())
    .then(() => {
      this.router.navigate(['verify-email']);
      this.createUserInCollection(this.userData);
    })
  }

  /* Crear usuario en colección */
  async createUserInCollection(user){
    const currentUser = firebase.auth().currentUser;
    this.afStore.collection('users').doc(currentUser.uid).set({
      'userId' : user.uid,
      'userName': 'Mi nombre',
      'userEmail': user.email,
      'userPhone': '000-000-000',
      'userPhoto': 'assets/User-Icon-Grey.png',
      'createdAt': Date.now(),
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
  async updateUserInCollection(userExtended){
    const currentUser = firebase.auth().currentUser;
    this.afStore.collection('users').doc(currentUser.uid).set({
      'userId' : userExtended.userId,
      'userName': userExtended.userName,
      'userEmail': userExtended.userEmail,
      'userPhone': userExtended.userPhone,
      'userPhoto': userExtended.userPhoto,
      'createdAt': Date.now(),
      'userrol' : 'viewer',
    })
    console.log('Current User: ',currentUser);
  }

  /* Recuperar password */
  async PasswordRecover(passwordResetEmail) {
    return this.ngFireAuth.sendPasswordResetEmail(passwordResetEmail)
    .then(() => {
      window.alert('Password reset email has been sent, please check your inbox.');
    }).catch((error) => {
      window.alert(error)
    })
  }

  /* Devuelve true cuando el usuario esta logado.*/
  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user'));
    return (user !== null && user.emailVerified !== false) ? true : false;
  }

  /* Devuelve true cuando el email del usuario está verificado */
  get isEmailVerified(): boolean {
    const user = JSON.parse(localStorage.getItem('user'));
    return (user.emailVerified !== false) ? true : false;
  }

  /* Sign in con Gmail */
  async GoogleAuth() {
    return this.AuthLogin(new firebase.auth.GoogleAuthProvider());
  }

  /* Autenticacion con provider */
  async AuthLogin(provider) {
    return this.ngFireAuth.signInWithPopup(provider)
    .then((result) => {
       this.ngZone.run(() => {
          this.router.navigate(['dashboard']);
        })
      this.SetUserData(result.user);
    }).catch((error) => {
      window.alert(error)
    })
  }

  /* Almacenar usuario en localStorage */
  async SetUserData(user) {
    const userRef: AngularFirestoreDocument<any> = this.afStore.doc(`users/${user.uid}`);
    const userData: User = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified
    }
    return userRef.set(userData, {
      merge: true
    });
  }

  // Sign-out 
  async SignOut() {
    return this.ngFireAuth.signOut().then(() => {
      localStorage.removeItem('user');
      this.router.navigate(['login']);
    })
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