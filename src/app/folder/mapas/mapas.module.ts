import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { MapasPageRoutingModule } from './mapas-routing.module';

import { MapasPage } from './mapas.page';

import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder } from '@ionic-native/native-geocoder/ngx';

import { CatastroService } from '../../shared/services/catastro/catastro.service';

import { ListadoPage } from '../listado/listado.page'

@NgModule({
  declarations: [MapasPage],
  imports: [
    IonicModule.forRoot(),
    CommonModule,
    MapasPageRoutingModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Geolocation,
    NativeGeocoder,
    CatastroService,
    ListadoPage,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ]
})
<<<<<<< HEAD
export class MapasPageModule {}
=======
export class MapasPageModule {}
>>>>>>> mapas
