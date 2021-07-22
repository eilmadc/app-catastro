import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';
import { ModalController } from '@ionic/angular';

import { CatastroService } from '../../shared/services/catastro/catastro.service';
import { IMarkilo } from '../../shared/interfaces/catastro.modelos';

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
    /* solicitamos la colección de markilos */
    await this.catastro.markilosLoadLS();
    this.markilos = await this.catastro.markilosGet();
    console.log('markilos: ',this.markilos);
  }

  ionViewDidEnter() {
    this.loadMap();
  }


async loadMap() {

  var globalArray=[];

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
        fillOpacity: 0.8,
        strokeWeight: 0,
        rotation: 0,
        scale: 2,
        anchor: new google.maps.Point(15, 30),
      };

      // var infowindow = new google.maps.InfoWindow();

      this.markilos.forEach(markilo => {
        console.log('foreach');
            //crea la variable position usada en google.maps.Marker para posicionar los marcadores en el mapa
            let position = {
              lat: markilo.latitud,
              lng: markilo.longitud
            }

             new google.maps.Marker({
                position: position,
                map: this.map,
                title: markilo.nota,
                icon: svgMarker
              });
              console.log('markilo');

              globalArray.push( markilo );

              google.maps.event.addListener(markilo, 'click', function () {
                infowindow.setContent('<h3>' + this.title + '</h3>');
                infowindow.open(this.map, this);
                console.log('click');
              });
  
            });
     

      mapEle.classList.add('show-map');

      const contentString = '<div id="content" style="color: red;">' +
      '<h1 id="firstHeading" class="firstHeading">' + 'globalArray[0].nota' + '<h1>' +
      '<p>Latitud: ' + 'globalArray[0].latitud' + '<p>' +
      '<p>Longitud: ' + 'globalArray[0].longitud' + '<p>' +
      '</div>';

      const infowindow = new google.maps.InfoWindow({
        content: contentString,
      });
  
      const markilo = new google.maps.Marker({
        position: myLatLng,
        map: this.map,
        title: "Uluru (Ayers Rock)",
      });

      markilo.addListener("click", () => {
        infowindow.open({
          anchor: markilo,
          map: this.map,
          shouldFocus: false,
        });
      });

      
    });

    this.map.addListener('dragend', () => {
      this.latitude = this.map.center.lat();
      this.longitude = this.map.center.lng();
    });

    

    
 
    


      }
  }