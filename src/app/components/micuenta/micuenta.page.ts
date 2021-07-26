import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { LoadingController } from '@ionic/angular';
import { UserExtended } from 'src/app/shared/interfaces/user';
import { AuthenticationService } from 'src/app/shared/services/authentication-service.ts.service';
import * as firebase from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-micuenta',
  templateUrl: './micuenta.page.html',
  styleUrls: ['./micuenta.page.scss'],
})
export class MicuentaPage {
    userInfo: any = "";
    userExtended: UserExtended;

  constructor(
    public auth: AuthenticationService,
    public ngFireAuth: AngularFireAuth,
    private afStore: AngularFirestore,
    private loadingCtrl: LoadingController,
    private router: Router,
  ) { 
    
  }

  ionViewDidEnter() {
    const currentUserUid = firebase.default.auth().currentUser.uid;
    console.log(currentUserUid);
    this.afStore.collection('users').doc(currentUserUid).get()
    .subscribe((doc) =>{
      if (doc.exists) {
        console.log("Document data: ", doc.data());
        this.userInfo= doc.data();
      }else{
        console.log("No such document");
        //return ("")
      }
    },(error) => {console.error("Error:")}
    );
    /* const userInfo = this.auth.getUserFromCollection()
    .then((doc) =>{
      console.log(`Successfully fetched user data`);
      console.log(doc);
    }).catch((error) => {
      console.log('Error fetching user data:', error);
    });

    console.log('UserInfo: ',userInfo); */
  }

  getValueInput(event: CustomEvent){
    console.log(event.detail.userName.getValueInput);
  }

 updateUser(){
    this.auth.updateUserInCollection(this.userExtended);  
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
