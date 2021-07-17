//
//
import { Component, OnInit, Input } from '@angular/core';

import { CatastroService } from '../../shared/services/catastro/catastro.service';
import {
            IInmueble,
            IReturnModeloCatastro,
            IMarkilo                } from '../../shared/interfaces/catastro.modelos';

//
//
@Component({
                selector: 'app-listado',
                templateUrl: './listado.page.html',
                styleUrls: ['./listado.page.scss'],
            })

//
//
export class ListadoPage implements OnInit {

    //
    @Input() markilos: IMarkilo[] = [];

    //
    constructor(private catastro: CatastroService,) { }

    //
    async ngOnInit() {
        /* recrea en locaStorage una serie de registros, IMarkilo, para tests */
        await this.catastro.test__CrearHistorico_en_localStorage();

        /* rellena la matriz para visualizar en el tab */
        for (var i = 0; i < localStorage.length; i++) {
            let k = localStorage.key(i);
            if ( (k) != 'user' ) {
                let mkl: IMarkilo = JSON.parse(localStorage.getItem(k));
                this.markilos.push(mkl);
            }
        }
    }


    /*
        Petición para mostrar información de una (IParcela|IInmueble) através de su |referenciaCatastral|.

        @param {string} referenciaCatastral que señala a la referencia catastral de un (IParcela|IInmueble).
        
    */
    modeloCatastroDetalles(referenciaCatastral: string) {
        console.log(referenciaCatastral)
    }
}
