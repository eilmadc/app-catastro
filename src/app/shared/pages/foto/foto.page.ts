//
//
import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { CamaraService } from '../../services/camara.service';
import { CatastroService } from '../../services/catastro/catastro.service';

import { IMarkilo } from '../../interfaces/catastro.modelos';
import { IFoto } from '../../interfaces/foto.modelo';

//
//
@Component({
                    selector:       'app-foto',
                    templateUrl:    './foto.page.html',
                    styleUrls:      ['./foto.page.scss'],
                })

//
//
export class FotoPage implements OnInit {

    //
    constructor(public modalController: ModalController,
                public catastroServicio: CatastroService,
                public camaraServicio: CamaraService) { }

    //
    async ngOnInit() {  
        await this.camaraServicio.fotosLoad(); 
    }


    /*
        Asigna una IFoto a |markilo| y cierra la pagina.

        @param  {IMarkilo}, markilo 
        @param  {IFoto}, foto que sera añadido al |markilo|
    */
    async btFotoAsignarAMarkilo(markilo: IMarkilo, foto: IFoto) {

        markilo.foto = foto;
        markilo.fotografia = foto.webviewPath;
        await this.catastroServicio.markiloSet(markilo);
        
        this.btCerrar();
    }
    
    /* 
    Cierra esta pagina
    */
   async btCerrar() {
        //await this.camaraServicio.fotosLoad();
        await this.modalController.dismiss();
    }
}