import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';

import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { MapasPageRoutingModule } from './mapas-routing.module';

import { MapasPage } from './mapas.page';

import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder } from '@ionic-native/native-geocoder/ngx';

@NgModule({
  declarations: [MapasPage],
  imports: [
    IonicModule.forRoot(),
    CommonModule,
    // FormsModule,
    // IonicModule,
    MapasPageRoutingModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Geolocation,
    NativeGeocoder,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ]
})
export class MapasPageModule {}

// import { NgModule } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';

// import { IonicModule } from '@ionic/angular';

// import { MapasPageRoutingModule } from './mapas-routing.module';

// import { MapasPage } from './mapas.page';

// @NgModule({
//   imports: [
//     CommonModule,
//     FormsModule,
//     IonicModule,
//     MapasPageRoutingModule
//   ],
//   declarations: [MapasPage]
// })
// export class MapasPageModule {}
