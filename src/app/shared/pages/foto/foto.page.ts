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
        //alert('entrando en foto/ngOnInit')
        //await this.camaraServicio.fotosLoad();
        //alert(this.camaraServicio.fotos.length)
    }


    /*
        ...

    */
    async btFotoAsignarAMarkilo(foto: IFoto, i: number, markilo: IMarkilo) {

        markilo.foto = foto;
        await this.catastroServicio.markiloSet(markilo);
    
        this.cerrar();
    }


    /* 
        Cierra esta pagina
    */
    async cerrar() {
        await this.modalController.dismiss();
    }
}