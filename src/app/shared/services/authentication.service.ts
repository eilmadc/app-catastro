import { Injectable, NgZone } from '@angular/core';
import  firebase from 'firebase/app';
import { User , Roles, UserExtended} from "../interfaces/user";
import { Router } from "@angular/router";
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { firebaseConfig } from 'src/environments/firebaseconfig';
import { ToastController } from '@ionic/angular';
import { UsersCrudService} from './users-crud.service';


@Injectable({
  providedIn: 'root'
})

export class AuthenticationService {
  userData: any;
  user$:UserExtended;
  docRef = this.afStore.collection('users');

  constructor(
    public afStore: AngularFirestore,
    public ngFireAuth: AngularFireAuth,
    public router: Router,  
    public ngZone: NgZone ,
    private toastr: ToastController,
    private userCrud: UsersCrudService,
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


  /* SIGNIN mail: Login con email/password */
  async SignIn(email, password) {
    return this.ngFireAuth.signInWithEmailAndPassword(email, password).then(() =>{
       this.toast("Login correcto", "warning");
    },(err => console.log(err)));
  }

  /* CREATE NEW USER: Registro con email/password */
  async RegisterUser(email, password) {
    return this.ngFireAuth.createUserWithEmailAndPassword(email, password)
  }

  /* SEND EMAIL NEW USER: Verificación de email cuando un nuevo usuario se registra */
  async SendVerificationMail() {
    return this.ngFireAuth.currentUser.then(e => e.sendEmailVerification())
    .then(() => {
      /* Se redirige la navegación a la pagina de verificacion de email */
      this.router.navigate(['verify-email']);
      /* Creación del usuario en la coleccion 'users' */
      this.userCrud.createUserInCollection(this.userData);
    }).catch((error) => {
      window.alert(error.message);
    });
  }

  /* PASSWORD-RECOVER: Recuperar password */
  async PasswordRecover(passwordResetEmail) {
    return this.ngFireAuth.sendPasswordResetEmail(passwordResetEmail)
    .then(() => {
      window.alert('Password reset email has been sent, please check your inbox.');
    }).catch((error) => {
      window.alert(error)
    })
  }

  /* ISLOGGEDIN: Devuelve true cuando el usuario esta logado.*/
  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user'));
    return (user !== null && user.emailVerified !== false) ? true : false;
  }

  /* IS EMAIL VERIFIED:Devuelve true cuando el email del usuario está verificado */
  get isEmailVerified(): boolean {
    const user = JSON.parse(localStorage.getItem('user'));
    return (user.emailVerified !== false) ? true : false;
  }

  /* SIGNIN: Login con Gmail */
  async GoogleAuth() {
    return this.AuthLogin(new firebase.auth.GoogleAuthProvider());
  }

  /* SIGNIN: Autenticacion con provider */
  async AuthLogin(provider) {
    return this.ngFireAuth.signInWithPopup(provider)
    .then((result) => {
       this.ngZone.run(() => {
          this.router.navigate(['folder/home']);
        })
      this.SetUserData(result.user);
      this.userCrud.createUserInCollection(result.user);
    }).catch((error) => {
      window.alert(error)
    })
  }

  /* SET LOCALSTORAGE: Almacenar usuario en localStorage */
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

  /* SIGNOUT : Cerrar sesión de usuario*/
  async SignOut() {
    return this.ngFireAuth.signOut().then(() => {
      this.deleteLocalStorage();
      this.router.navigate(['login']);
      this.toast("La sesión ha sido cerrada", "warning");
    }).catch((error) => {
      window.alert(error);
    })
  }

  async deleteLocalStorage(){
    this.ngFireAuth = null;
    this.userData = null;
    await localStorage.remove('token');
    await localStorage.remove('user');
    localStorage.clear();
  }
    //Metodo para envío de mensajes Toast.
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
}
