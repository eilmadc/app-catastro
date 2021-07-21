//
//
import {    Component, OnInit,
            AfterViewInit, ElementRef, Input, ViewChild} from '@angular/core';
import { ModalController } from '@ionic/angular';

import {     environment } from 'src/environments/environment';

import * as mapboxgl from 'mapbox-gl';
import { IMarkilo } from '../../interfaces/catastro.modelos';

//
@Component({
                    selector: 'app-mapa',
                    templateUrl: './mapa.page.html',
                    styleUrls: ['./mapa.page.scss'],
                })

//
//
export class MapaPage implements OnInit, AfterViewInit {

    //
    @Input() markilo: IMarkilo;
    @ViewChild('mapa') divMapa!: ElementRef;

    //
    constructor(public modalController: ModalController) { }

    //
    ngOnInit(): void {}

    //
    ngAfterViewInit(): void {

        mapboxgl.accessToken = environment.mapboxToken;
        var mapa = new mapboxgl.Map({
            container:      this.divMapa.nativeElement,
            style:          'mapbox://styles/mapbox/streets-v11',
            center:         {lng: this.markilo.longitud, lat: this.markilo.latitud},
            zoom:           18,
            interactive:    false
        });
        
        
        new mapboxgl.Marker()                       // marca las coordenadas
            .setLngLat({lng: this.markilo.longitud, lat: this.markilo.latitud})
            .addTo(mapa);

        mapa.on('load', function () {               // imprescindible ... hace el zoom para cuadrarlo en la pantalla.
            mapa.resize();
        });

        new mapboxgl.Popup({ closeOnClick: false })
            .setLngLat({ lng: this.markilo.longitud, lat: this.markilo.latitud })
            .setHTML('<h3>' + this.markilo.nota + '</h3>')
            .addTo(mapa);
    }

    /* 
        Cierra esta pagina
    */
    cerrar() {
        this.modalController.dismiss();
    }
}
