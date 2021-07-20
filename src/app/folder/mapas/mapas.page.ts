import { Component, OnInit, Input, ComponentRef, ViewChild, ElementRef, isDevMode } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';
import { ModalController } from '@ionic/angular';

import { CatastroService } from '../../shared/services/catastro/catastro.service';
import {    //IInmueble,
            //IReturnModeloCatastro,
            IMarkilo } from '../../shared/interfaces/catastro.modelos';
import { ParcelaPage } from '../../shared/pages/parcela/parcela.page'
import { InmueblePage } from '../../shared/pages/inmueble/inmueble.page'

import { ListadoPage } from '../listado/listado.page'

declare var google;

interface Marker {
  position: {
    lat: number,
    lng: number,
  };
  title: string;
}



@Component({
  selector: 'app-mapas',
  templateUrl: './mapas.page.html',
  styleUrls: ['./mapas.page.scss'],
})
export class MapasPage implements OnInit {

  @Input() markilos: IMarkilo[] = [];

  constructor(private catastro: CatastroService,
    public modalController: ModalController,
    private listadoPage: ListadoPage) {}

  @ViewChild('map', { read: ElementRef, static: false }) mapElement: ElementRef;
  address: string;

  latitude: number;
  longitude: number;

  infoWindows: any = [];

  map = null;
  markers: Marker[] = [
    {
      position: {
        lat: 41.3918415,
        lng: 2.1156554,
      },
      title: 'Jardín Botánico'
    },
    {
      position: {
        lat: 41.3918415,
        lng: 2.1166554,
      },
      title: 'Parque la 93'
    },
    {
      position: {
        lat: 41.3918415,
        lng: 2.2256554,
      },
      title: 'Maloka'
    },
    {
      position: {
        lat: 41.40356145365357,
        lng: 2.1744767782584358
      },
      title: 'Sagrada Familia (Barcelona)'                         // es Inmueble
    },
  ];

  async ngOnInit() {
    /* Si no estamos en modo_developer recrearemos en localStorage un historico, si es que ya no esta */
    await this.listadoPage.__test__Recrear_historico_en_localStorage_si_esta_en_mode_developer();
        
    /* solicitamos la colección de markilos */
    await this.catastro.markilosLoadLS();
    this.markilos = await this.catastro.markilosGet();
  }

  ionViewDidEnter() {
    this.loadMap();
  }


async loadMap() {

      const coordinates = await Geolocation.getCurrentPosition();
      this.latitude = coordinates.coords.latitude;
      this.longitude = coordinates.coords.longitude;
      // create a new map by passing HTMLElement
      const mapEle: HTMLElement = document.getElementById('map');
      // create LatLng object
      const myLatLng = new google.maps.LatLng(coordinates.coords.latitude, coordinates.coords.longitude);
      // create map
      this.map = new google.maps.Map(mapEle, {
        center: myLatLng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        disableDefaultUI: true
      });



    google.maps.event.addListenerOnce(this.map, 'idle', () => {
      const svgMarker = {
        path: "M10.453 14.016l6.563-6.609-1.406-1.406-5.156 5.203-2.063-2.109-1.406 1.406zM12 2.016q2.906 0 4.945 2.039t2.039 4.945q0 1.453-0.727 3.328t-1.758 3.516-2.039 3.070-1.711 2.273l-0.75 0.797q-0.281-0.328-0.75-0.867t-1.688-2.156-2.133-3.141-1.664-3.445-0.75-3.375q0-2.906 2.039-4.945t4.945-2.039z",
        fillColor: "darkorange",
        fillOpacity: 0.6,
        strokeWeight: 0,
        rotation: 0,
        scale: 2,
        anchor: new google.maps.Point(15, 30),
      };  
      this.markilos.forEach(markilo => {
             new google.maps.Marker({
                // latitud: markilo.latitud,
                // longitud: markilo.longitud,
                position: markilo.position,
                map: this.map,
                title: markilo.nota,
                icon: svgMarker
              });
              console.log(markilo.position);
              console.log(markilo.nota);
              console.log(markilo.latitud);
              console.log(markilo.longitud);
            });


      mapEle.classList.add('show-map');
    });

    this.map.addListener('dragend', () => {
      console.log('accuracy',this.map, this.map.center.lat());
      this.latitude = this.map.center.lat();
      this.longitude = this.map.center.lng();
    });

    //this.addInfoWindowToMarker(this.markers);

    // const marker = new google.maps.Marker({
    //   position: myLatLng,
    //   map: this.map,
    //   title: "Click to zoom",
    // });

    // marker.addListener("click", () => {
    //   this.map.setZoom(8);
    //   this.map.setCenter(marker.getPosition());
    // });


    // const contentString =
    // '<div id="content">' + 
    //                         '<h2 id="firstHeading" class="firstHeading">' + this.markers.title + '<h2>' +
    //                         '<p>Latitud: ' + this.markers.lat + '<p>' +
    //                         '<p>Longitud: ' + this.markers.longitude + '<p>' +
    //                         '</div>';
    
    // var infowindow = new google.maps.InfoWindow();  
    // google.maps.event.addListener(this.markers, 'click', (function(markers) {
    //   this.map.setZoom(8);
    //   this.map.setCenter(marker.getPosition());
    // })(this.markers));
    // , (function(markers) {  
    //        return function() {  
    //          console.log('click');
    //            var content = contentString;  
    //            infowindow.setContent(content);  
    //            infowindow.open(mapEle, markers);  
    //        }  
    //      })(this.markers)); 
     
  }


}