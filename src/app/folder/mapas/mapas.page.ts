import { AttributeMarker } from '@angular/compiler/src/core';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
// import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';

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

  @ViewChild('map', { read: ElementRef, static: false }) mapElement: ElementRef;
  // map: any;
  address: string;

  latitude: number;
  longitude: number;

  infoWindows: any = [];
  // markers: any = [
  //   {
  //     title: 'Prueba',
  //     latitude: '41.3918415',
  //     longitude: '2.1156554'
  //   },
  //   {
  //     title: 'Prueba 2',
  //     latitude: '41.3918415',
  //     longitude: '2.1166554'
  //   },
  //   {
  //     title: 'Prueba 3',
  //     latitude: '41.3918415',
  //     longitude: '2.2256554'
  //   },
  // ]

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
  ];

  constructor(
    private geolocation: Geolocation,
    // private nativeGeocoder: NativeGeocoder
    ) { }

  ngOnInit() {
    this.loadMap();
  }

 

  // loadMap(coordinates ):void {
  //   const latLng = new google.maps.LatLng(
  //     coordinates.coords.latitude,
  //     coordinates.coords.longitude
  //   );
  //   const mapOptions = {
  //     center: latLng,
  //     zoom: 10,
  //     mapTypeId: google.maps.MapTypeId.ROADMAP,
  //     };
  //     this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
  //     this.addMarker(this.map);
  // }

  // addMarker(map): void{
  //   const marker = new google.maps.Marker({
  //     map,
  //     animation: google.maps.Animation.DROP,
  //     position: map.getCenter(),
  //   });
  // }

  loadMap() {
    this.geolocation.getCurrentPosition().then((resp) => {
      
      this.latitude = resp.coords.latitude;
      this.longitude = resp.coords.longitude;

      // create a new map by passing HTMLElement
      const mapEle: HTMLElement = document.getElementById('map');
      // create LatLng object
      const myLatLng = new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude);
      // create map
      this.map = new google.maps.Map(mapEle, {
        center: myLatLng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        disableDefaultUI: true
      });

    // this.getAddressFromCoords(resp.coords.latitude, resp.coords.longitude);

    google.maps.event.addListenerOnce(this.map, 'idle', () => {
      this.renderMarkers();
      mapEle.classList.add('show-map');
    });

    this.map.addListener('dragend', () => {
      console.log('accuracy',this.map, this.map.center.lat());
      this.latitude = this.map.center.lat();
      this.longitude = this.map.center.lng();
      // this.getAddressFromCoords(this.map.center.lat(), this.map.center.lng())
    });

    this.addInfoWindowToMarker(this.markers);

  })
 .catch((error: any) => {
   this.address = "¡Dirección no disponible!";
  });
  }

  renderMarkers() {
    this.markers.forEach(marker => {
      this.addMarker(marker);
    });
  }

  addMarker(marker: Marker) {
    //this.addInfoWindowToMarker(marker);
    let markers = new google.maps.Marker({
      position: marker.position,
      map: this.map,
      title: marker.title,
    });
    return markers;
  }

  // addMarkersToMap(markers){
  //   for (let marker of markers) {
  //     let position = new google.map.LatLng(marker.latitude, marker.longitude);
  //     let mapMarker = new google.map.Markers({
  //       position: position,
  //       title: marker.title,
  //       latitude: marker.latitude,
  //       longitude: marker.longitude
  //     });

  //     mapMarker.setMap(this.map);
  //     this.addInfoWindowToMarker(mapMarker);
  //   }
  // }

  addInfoWindowToMarker(markers) {
    let mapMarker = this.addMarker(markers);
    mapMarker.setMap(this.map);
    console.log('setmap');
    let infoWindowContent = '<div id="content">' + 
                            '<h2 id="firstHeading" class="firstHeading">' + markers.title + '<h2>' +
                            '<p>Latitud: ' + markers.latitude + '<p>' +
                            '<p>Longitud: ' + markers.longitude + '<p>' +
                            '</div>';
    
    console.log('content');
                        
    let infoWindow = new google.maps.infoWindow({
      content: infoWindowContent
    });
    console.log('infowindow');

    markers.addListener('click', () => {
      console.log('click');
      this.closeAllInfoWindows();
      infoWindow.open(this.map, markers);
    });
    this.infoWindows.push(infoWindow);
  }

  closeAllInfoWindows() {
    for(let window of this.infoWindows) {
      window.close();
    }
  }




  // loadMap() {
          
  //   this.geolocation.getCurrentPosition().then((resp) => {

  //     this.latitude = resp.coords.latitude;
  //     this.longitude = resp.coords.longitude;

  //     const latLng = new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude);
  //     let mapOptions = {
  //       center: latLng,
  //       zoom: 15,
  //       mapTypeId: google.maps.MapTypeId.ROADMAP,
  //       disableDefaultUI: true

  //     }

  //     this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
  //     this.addMarker(this.map);



  //     this.getAddressFromCoords(resp.coords.latitude, resp.coords.longitude);
  //     this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

  //     this.addMarkersToMap(this.markers);

  //     this.map.addListener('dragend', () => {
  //       console.log('accuracy',this.map, this.map.center.lat());
  //       this.latitude = this.map.center.lat();
  //       this.longitude = this.map.center.lng();
  //       this.getAddressFromCoords(this.map.center.lat(), this.map.center.lng())
  //     });

  //   }).catch((error) => {
  //     console.log('Error getting location', error);
  //   });
  // }

  // addMarker(map): void{
  //   const marker = new google.maps.Marker({
  //     map,
  //     animation: google.maps.Animation.DROP,
  //     position: map.getCenter(),
  //   });
  // }

  // getAddressFromCoords(lattitude, longitude) {
  //   console.log("getAddressFromCoords " + lattitude + " " + longitude);
  //   let options: NativeGeocoderOptions = {
  //     useLocale: true,
  //     maxResults: 5
  //   };
  //   this.nativeGeocoder.reverseGeocode(lattitude, longitude, options)
  //     .then((result: NativeGeocoderResult[]) => {
  //       this.address = "";
  //       let responseAddress = [];
  //       for (let [key, value] of Object.entries(result[0])) {
  //         if (value.length > 0)
  //           responseAddress.push(value);
  //       }
  //       responseAddress.reverse();
  //       for (let value of responseAddress) {
  //         this.address += value + ", ";
  //       }
  //       this.address = this.address.slice(0, -2);
  //     })
  //     .catch((error: any) => {
  //       this.address = "¡Dirección no disponible!";
  //     });

  // }

  }
