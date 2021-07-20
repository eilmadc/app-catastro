//
//
import { isDevMode } from '@angular/core';
import { Component, OnInit, Input, ComponentRef } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { CatastroService } from '../../shared/services/catastro/catastro.service';
import {    IInmueble,
            IReturnModeloCatastro,
            IMarkilo                } from '../../shared/interfaces/catastro.modelos';
import { ParcelaPage } from '../../shared/pages/parcela/parcela.page'
import { InmueblePage } from '../../shared/pages/inmueble/inmueble.page'

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
    constructor(private catastro: CatastroService,
                public modalController: ModalController) {}

    //
    async ngOnInit() {
    
        /* Si no estamos en modo_developer recrearemos en localStorage un historico, si es que ya no esta */
        await this.__test__Recrear_historico_en_localStorage_si_esta_en_mode_developer();
        
        /* solicitamos la colección de markilos */
        await this.catastro.markilosLoadLS();
        this.markilos = await this.catastro.markilosGet();
    }


    /*
        Cambia el estado |makilo.favorito| a su nuevo valor. 

        @param  {} markilo
    */
    btMarkiloFavorito(markilo: IMarkilo){ 
        markilo.favorito = ! markilo.favorito;
        this.catastro.markiloSet(markilo);
    }


    /*
        Nos lleva al lugar del mapa 

        @param {string} referenciaCatastral que señala a la referencia catastral de un (IParcela|IInmueble).

        @param  {number} latitud, responde a la coordenada de la latitud
        @param  {number} longitud, responde a la coordenada de longitud
    */
    btMapaIr(latitud: number, longitud: number) {
        // ir a Mapa
    }


    /*
        Muestra información detallada del ítem seleccionado, desde su |referenciaCatastral|, que es el markilo.id
        de un elemento existente en |markilos|.
        La llamada a markilos[referenciaCatastral]
        Petición para mostrar información de una (IParcela|IInmueble) através de su |referenciaCatastral|.

        @param {string} referenciaCatastral que señala a la referencia catastral de un (IParcela|IInmueble).

    */
    async btModeloCatastroDetalles(referenciaCatastral: string) {

        let mc;                                 // (IInmueble|IParcela)
        let paginaCatastral;
        let componenteProps= {};
        
        let markilo: IMarkilo = this.catastro.markiloGet(referenciaCatastral);

        if (this.catastro.esParcela(markilo.irmc.modeloCatastro) == true ) {
            paginaCatastral = ParcelaPage;
            componenteProps = {     'fecha':                markilo.id,
                                    'latitud':              markilo.latitud,
                                    'longitud':             markilo.longitud,
                                    'nota':                 markilo.nota,
                                    'rcParcela':            markilo.irmc.modeloCatastro.rcParcela,
                                    'domicilioTributario':  markilo.irmc.modeloCatastro.domicilioTributario,
                                    'poblacion':            markilo.irmc.modeloCatastro.poblacion,
                                    'provincia':            markilo.irmc.modeloCatastro.provincia,
                                    'rcInmueble':           markilo.irmc.modeloCatastro.rcInmueble,
                                    'pcInmuebles':          markilo.irmc.modeloCatastro.parcelaInmuebles,
                                };
        } else {
            paginaCatastral = InmueblePage;
            componenteProps = {     'fecha':                markilo.id,
                                    'latitud':              markilo.latitud,
                                    'longitud':             markilo.longitud,
                                    'nota':                 markilo.nota,
                                    'rcInmueble':           markilo.irmc.modeloCatastro.rcInmueble,
                                    'clase':                markilo.irmc.modeloCatastro.clase,
                                    'localizacion':         markilo.irmc.modeloCatastro.localizacion,
                                    'usoPrincipal':         markilo.irmc.modeloCatastro.usoPrincipal,
                                    'superficieConstruida': markilo.irmc.modeloCatastro.superficieConstruida,
                                    'anoConstruccion':      markilo.irmc.modeloCatastro.anoConstruccion,
                                    'ipLocalizacion':       markilo.irmc.modeloCatastro.inmuebleParcela.localizacion,
                                    'ipCoefParticipacion':  markilo.irmc.modeloCatastro.inmuebleParcela.coeficienteParticipacion,
                                    'icConstrucciones':     markilo.irmc.modeloCatastro.inmuebleConstruccion,
                                };
        };

        const modal = await this.modalController.create({
            component:          paginaCatastral,
            cssClass:           'my-custom-class',
            componentProps:     componenteProps
        });
        
        return await modal.present(); 
    }

    /* 
        Solo si esta en mode developer ... recrea en locaStorage una serie de registros, IMarkilo, para tests. 
    */
    async __test__Recrear_historico_en_localStorage_si_esta_en_mode_developer() {
        if (isDevMode() == true) {
            await this.catastro.test__CrearHistorico_en_localStorage();
        }
    }
}
