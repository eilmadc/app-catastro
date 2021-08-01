import { Component, Input, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireStorage } from "@angular/fire/storage";
import { LoadingController, ModalController } from '@ionic/angular';
import { UserExtended } from 'src/app/shared/interfaces/user';


import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { CamaraService } from 'src/app/shared/services/camara.service';

import { Router } from '@angular/router';
import { UsersCrudService} from "src/app/shared/services/users-crud.service";

@Component({
  selector: 'app-micuenta',
  templateUrl: './micuenta.page.html',
  styleUrls: ['./micuenta.page.scss'],
})
export class MicuentaPage implements OnInit {
  userInfo: any = "";
  docRef = this.afStore.collection('users');
  time:any;

  constructor(
    public auth: AuthenticationService,
    private userCrud: UsersCrudService,
    public ngFireAuth: AngularFireAuth,
    private afStore: AngularFirestore,
    private router: Router,
    public modalController: ModalController,
        /* LLamada a OBTENER INFO DEL USUARIO ACTUAL EN FIREBASE*/
  ) { 
    this.userInfo = this.getUser();
  }

  ngOnInit() {
    this.userInfo = this.getUser();
  }

  ionViewDidEnter() {
    this.userInfo = this.getUser();
  }

  /* CREATED DATE FORMATED: Formateo a dd-MM-yyyy el campo createdAt del usuario en FB*/
  async getCreatedAtFormatted(){
    this.time = await  this.userInfo.createdAt.toDate();
  }

 /* READ USER INFO: Leer la info del usuario
 * metodo: getUserInfoFromCollection */
 async getUser(){
  return (await this.userCrud.getUserInfoFromCollection()).subscribe((data)=>{
     this.userInfo = data;
     this.getCreatedAtFormatted();
   })
 }

  /* UPDATE USER INFO: Actualizar datos del usuario en collection 'users' */
 async updateUserCollection(username, userphone, userrol){
   this.userCrud.updateUserInCollection(username.value,userphone.value,userrol.value);
  } 


  /* DELETE USER INFO: Borrar datos del usuario en collection 'users' y en Firebase */
    async remove( ){
      this.getUser();
      if (window.confirm('¿Estas seguro?')){
        this.userCrud.delete(this.userInfo.userId);
      }
    }


  /* GOTOFAVORITOS: Redirección a la pagina de favoritos*/
    goToFavoritos(){
      this.router.navigate(['folder/favoritos']);
    }


    /* GOTORESETPASSWORD: Redirección a resetpassword page */
    recoverPassword(){
      this.router.navigate(['login/reset-password']);
    }


  }    
