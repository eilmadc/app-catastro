import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';
import { ModalController } from '@ionic/angular';

import { CatastroService } from '../../shared/services/catastro/catastro.service';
import { IMarkilo } from '../../shared/interfaces/catastro.modelos';

declare var google;

@Component({
  selector: 'app-mapas',
  templateUrl: './mapas.page.html',
  styleUrls: ['./mapas.page.scss'],
})
export class MapasPage implements OnInit {

 @Input() markilos: IMarkilo[] = [];

  constructor(public catastro: CatastroService,
              public modalController: ModalController) {}

  @ViewChild('map', { read: ElementRef, static: false }) mapElement: ElementRef;

  address: string;

  latitude: number;
  longitude: number;

  infoWindows: any = [];

  map = null;

  async ngOnInit() {
    /* solicitamos la colección de markilos */
    await this.catastro.markilosLoad();
    this.markilos = await this.catastro.markilosGet();
  }

  ionViewDidEnter() {
    this.loadMap();
  }

  //comentario 
  async loadMap() {

    var showFav = true;

    var infoWindow = new google.maps.InfoWindow();

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

 //       var color = (data.favorito == true && showFav == true) ? "purple" : "darkorange";

        //marcadores genéricos
        const svgMarker = {
          path: "M10.453 14.016l6.563-6.609-1.406-1.406-5.156 5.203-2.063-2.109-1.406 1.406zM12 2.016q2.906 0 4.945 2.039t2.039 4.945q0 1.453-0.727 3.328t-1.758 3.516-2.039 3.070-1.711 2.273l-0.75 0.797q-0.281-0.328-0.75-0.867t-1.688-2.156-2.133-3.141-1.664-3.445-0.75-3.375q0-2.906 2.039-4.945t4.945-2.039z",
          fillColor: "darkorange",
          fillOpacity: 0.8,
          strokeWeight: 0,
          rotation: 0,
          scale: 2,
          anchor: new google.maps.Point(15, 30),
        };

        //marcadores en favoritos
        const favMarker = {
          path: "M10.453 14.016l6.563-6.609-1.406-1.406-5.156 5.203-2.063-2.109-1.406 1.406zM12 2.016q2.906 0 4.945 2.039t2.039 4.945q0 1.453-0.727 3.328t-1.758 3.516-2.039 3.070-1.711 2.273l-0.75 0.797q-0.281-0.328-0.75-0.867t-1.688-2.156-2.133-3.141-1.664-3.445-0.75-3.375q0-2.906 2.039-4.945t4.945-2.039z",
          fillColor: "purple",
          fillOpacity: 0.9,
          strokeWeight: 0,
          rotation: 0,
          scale: 2,
          anchor: new google.maps.Point(15, 30),
        };

        for (var i = 0; i < this.markilos.length; i++) {
          var data = this.markilos[i];
          var myLatlng = new google.maps.LatLng(data.latitud, data.longitud);
          var marker = new google.maps.Marker({
              position: myLatlng,
              map: this.map,
              title: data.nota,   
              //los marcadores tienen colores distinos dependiendo de si están o no en el listado de favoritos
              icon: (data.favorito == true && showFav == true) ? favMarker : svgMarker
          });
            
              //Evento de click en cada marcador
            (function (marker, data) {
              google.maps.event.addListener(marker, "click", function (e) {
                  //Div con la información que aparecerá en InfoWindow
                  infoWindow.setContent('<div style="color:darkorange;width:200px;min-height:40px">' +  
                  '<h1 id="firstHeading" class="firstHeading">' +
                   data.nota + '</h1>' +
                  '<p>Latitud: ' + data.latitud + '<p>' +
                  '<p>Longitud: ' + data.longitud + '<p>' +
                  '</div>');
                  infoWindow.open(this.map, marker);
              });
            })(marker, data);
            
          }

        mapEle.classList.add('show-map');
     
      });

      //Cambio de latitud y longitud cuando se mueve el mapa
      this.map.addListener('dragend', () => {
        this.latitude = this.map.center.lat();
        this.longitude = this.map.center.lng();
      });

  //        document
  //           .getElementById("hide-fav")!
  //           .addEventListener("click", hideMarkers);
        
  }

  async jp(latitud: number, longitud: number): Promise<String> {

    let irrc = await this.catastro.getRCCOOR(latitud, longitud);

    const id = await this.catastro.markiloGenerateSave(latitud, longitud, irrc);

    return id
  }
}
