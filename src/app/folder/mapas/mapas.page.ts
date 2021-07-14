// import { AttributeMarker } from '@angular/compiler/src/core';
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

    const svgMarker = {
      path: "M10.453 14.016l6.563-6.609-1.406-1.406-5.156 5.203-2.063-2.109-1.406 1.406zM12 2.016q2.906 0 4.945 2.039t2.039 4.945q0 1.453-0.727 3.328t-1.758 3.516-2.039 3.070-1.711 2.273l-0.75 0.797q-0.281-0.328-0.75-0.867t-1.688-2.156-2.133-3.141-1.664-3.445-0.75-3.375q0-2.906 2.039-4.945t4.945-2.039z",
      fillColor: "darkorange",
      fillOpacity: 0.6,
      strokeWeight: 0,
      rotation: 0,
      scale: 2,
      anchor: new google.maps.Point(15, 30),
    };  

    let markers = new google.maps.Marker({
      position: marker.position,
      map: this.map,
      title: marker.title,
      icon: svgMarker,
      // animation: 'DROP',
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
    // let mapMarker = this.addMarker(markers);
    // mapMarker.setMap(this.map);
    // console.log('setmap');
    // let infoWindowContent = '<div id="content">' + 
    //                         '<h2 id="firstHeading" class="firstHeading">' + markers.title + '<h2>' +
    //                         '<p>Latitud: ' + markers.latitude + '<p>' +
    //                         '<p>Longitud: ' + markers.longitude + '<p>' +
    //                         '</div>';
    
    // console.log('content');


    // ~~~ INFOWINDOW ~~~


    // const contentString =
    // '<div id="content">' +
    // '<div id="siteNotice">' +
    // "</div>" +
    // '<h1 id="firstHeading" class="firstHeading">Uluru</h1>' +
    // '<div id="bodyContent">' +
    // "<p><b>Uluru</b>, also referred to as <b>Ayers Rock</b>, is a large " +
    // "sandstone rock formation in the southern part of the " +
    // "Northern Territory, central Australia. It lies 335&#160;km (208&#160;mi) " +
    // "south west of the nearest large town, Alice Springs; 450&#160;km " +
    // "(280&#160;mi) by road. Kata Tjuta and Uluru are the two major " +
    // "features of the Uluru - Kata Tjuta National Park. Uluru is " +
    // "sacred to the Pitjantjatjara and Yankunytjatjara, the " +
    // "Aboriginal people of the area. It has many springs, waterholes, " +
    // "rock caves and ancient paintings. Uluru is listed as a World " +
    // "Heritage Site.</p>" +
    // '<p>Attribution: Uluru, <a href="https://en.wikipedia.org/w/index.php?title=Uluru&oldid=297882194">' +
    // "https://en.wikipedia.org/w/index.php?title=Uluru</a> " +
    // "(last visited June 22, 2009).</p>" +
    // "</div>" +
    // "</div>";

    // const infowindow = new google.maps.InfoWindow({
    //   content: contentString,
    // });

    // markers.addListener("click", () => {
    //   infowindow.open({
    //     anchor: markers,
    //     map,
    //     shouldFocus: false,
    //   });
    // });


                        
    // let infoWindow = new google.maps.infoWindow({   
    //   content: infoWindowContent
    // });
    // console.log('infowindow');

    // markers.addListener('click', () => {
    //   console.log('click');
    //   this.closeAllInfoWindows();
    //   infoWindow.open(this.map, markers);
    // });
    // this.infoWindows.push(infoWindow);
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
