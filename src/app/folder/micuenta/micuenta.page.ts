import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { LoadingController } from '@ionic/angular';
import { UserExtended } from 'src/app/shared/interfaces/user';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import * as firebase from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { UsersCrudService} from "src/app/shared/services/users-crud.service";

@Component({
  selector: 'app-micuenta',
  templateUrl: './micuenta.page.html',
  styleUrls: ['./micuenta.page.scss'],
})
export class MicuentaPage implements OnInit {
  userInfo: any = "";
  userExtended: UserExtended;
  docRef = this.afStore.collection('users');
  time:any;


  constructor(
    public auth: AuthenticationService,
    private userCrud: UsersCrudService,
    public ngFireAuth: AngularFireAuth,
    private afStore: AngularFirestore,
    private loadingCtrl: LoadingController,
    private router: Router,
    
  ) { }

  ngOnInit() {
  }

  ionViewDidEnter() {
    /* LLamada a OBTENER INFO DEL USUARIO ACTUAL EN FIREBASE*/
    this.getCurrentUserInfo();
  }

  /* OBTENER INFO DEL USUARIO ACTUAL EN FIREBASE*/
 async getCurrentUserInfo(){
    const currentUserUid = firebase.default.auth().currentUser.uid;
    this.docRef.doc(currentUserUid).get().subscribe((doc) =>{
      if (doc.exists) {
        console.log("Document data: ", doc.data());
        this.userInfo= doc.data();
        this.getCreatedAtFormatted();
      }else{
        console.log("No such document");
      }
    },(error) => {console.error("Error:")}
    );
  }

  /* CREATED DATE FORMATED: Formateo a dd-MM-yyyy el campo createdAt del usuario en FB*/
  async getCreatedAtFormatted(){
    this.time = this.userInfo.createdAt.toDate();
    console.log(this.time);
  }

  /* UPDATE PHOTOURL PIC */
  updatePhoto(){

  }
  /* ACTUALIZAR DATOS DEL USUARIO en collection 'users' */
 async updateUserCollection(username, userphone, userrol){
   this.userCrud.updateUserInCollection(username,userphone,userrol);
 /*  const currentUserUid = firebase.default.auth().currentUser.uid;
  this.docRef.doc(currentUserUid).set({
    'userId' : this.userInfo.userId,
    'userName': username.value,
    'userEmail': this.userInfo.userEmail,
    'userPhone': userphone.value,
    'userPhoto': this.userInfo.userPhoto,
    'createdAt': this.userInfo.createdAt,
    'userrol' : userrol.value,
  }) */
    //this.auth.updateUserInCollection(this.userExtended);  
  } 

  /* async updateUser(){
    const loading = await this.loadingCtrl.create({
      message: 'Actualizando..',
      spinner: 'crescent',
      showBackdrop: true
    });

    loading.present();
 
    this.afStore.collection('users').doc(currentUser.uid).set({
      'userId' : user.uid,
      'userName': user.displayName,
      'userEmail': user.email,
      'userPhone': '',
      'userPhoto': user.photoURL,
      'createdAt': Date.now(),
      'userrol' : 'viewer',
    })
  }
  }
 */
    /* GOTOFAVORITOS: Redirección a la pagina de favoritos*/
    goToFavoritos(){
      this.router.navigate(['folder/favoritos']);
    }


    /* GOTORESETPASSWORD: Redirección a resetpassword page */
    recoverPassword(){
      this.router.navigate(['login/reset-password']);
    }

  

}
