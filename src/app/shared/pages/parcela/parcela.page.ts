//
//
import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

//
//
@Component({
                    selector:       'app-parcela',
                    templateUrl:    './parcela.page.html',
                    styleUrls:      ['./parcela.page.scss'],
                })

//
//
export class ParcelaPage implements OnInit {

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
