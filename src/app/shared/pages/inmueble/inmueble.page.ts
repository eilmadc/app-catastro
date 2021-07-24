//
//
import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

//
//
@Component({
                    selector:       'app-inmueble',
                    templateUrl:    './inmueble.page.html',
                    styleUrls:      ['./inmueble.page.scss'],
                })

//
//
export class InmueblePage implements OnInit {

    //
    constructor(public modalController: ModalController) { }

    //
    ngOnInit() {}

    /* 
        Cierra esta pagina
    */
    cerrar() {
        this.modalController.dismiss();
    }
}


