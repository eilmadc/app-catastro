import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppRoutingModule } from './app-routing.module';

//Firebase Authentication
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { firebaseConfig } from '../environments/firebaseconfig'; 

//Components
import { AppComponent } from './app.component';
import { LoginPageModule } from './components/login/login.module'
import { HomePageModule } from './folder/home/home.module';
import { MapasPageModule } from './folder/mapas/mapas.module';
import { ListadoPageModule } from './folder/listado/listado.module';
import { ConsultasPageModule } from './folder/consultas/consultas.module';
import { ContactoPageModule } from './folder/contacto/contacto.module';
import { AboutusPageModule } from './folder/aboutus/aboutus.module';
import { WebcatastroPageModule} from './folder/webcatastro/webcatastro.module'
import { RegistrationPageModule } from './components/login/registration/registration.module';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

// Acceder a Catastro
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent
  ],
  entryComponents: [],
  imports: [BrowserModule,
      IonicModule.forRoot(),
      AppRoutingModule,
      AngularFireModule.initializeApp(firebaseConfig),
      AngularFireAuthModule,
      AngularFireDatabaseModule,
      AngularFirestoreModule,
      HomePageModule,
      MapasPageModule,
      ListadoPageModule,
      ConsultasPageModule,
      ContactoPageModule,
      AboutusPageModule,
      WebcatastroPageModule,
      LoginPageModule,
      RegistrationPageModule,
      HttpClientModule,
    ],
  providers: [AngularFirestoreModule,InAppBrowser,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy,}
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
