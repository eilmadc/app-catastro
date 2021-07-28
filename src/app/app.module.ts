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

//Componentes de Login, Perfil de usuario.
import { RegistrationPageModule } from './components/login/registration/registration.module';
import { LoginPageModule } from './components/login/login.module'
import { LogoutPageModule } from './components/login/logout/logout.module';
import { ResetPasswordPageModule } from './components/login/reset-password/reset-password.module';


//Autenticacion Servicios
import { AuthenticationService } from "./shared/services/authentication.service";

//AppComponent + Menu Pages
import { AppComponent } from './app.component';
import { HomePageModule } from './folder/home/home.module';
import { MapasPageModule } from './folder/mapas/mapas.module';
import { ListadoPageModule } from './folder/listado/listado.module';
import { ContactoPageModule } from './folder/contacto/contacto.module';
import { AboutusPageModule } from './folder/aboutus/aboutus.module';
import { WebcatastroPageModule} from './folder/webcatastro/webcatastro.module'
import { FavoritosPageModule } from './folder/favoritos/favoritos.module';
import { MicuentaPageModule } from './folder/micuenta/micuenta.module';

//WebCatastro navegador App.
import { InAppBrowser } from '@ionic-native/in-app-browser';

// Acceder a Catastro
import { HttpClientModule } from '@angular/common/http';
import { TestPageModule } from './components/test/test.module';
import { EstadisticasPageModule } from './folder/estadisticas/estadisticas.module';

import { FormsModule } from '@angular/forms';

//Enviroments
import { firebaseConfig } from '../environments/firebaseconfig'; 
import { StatusBar } from '@ionic-native/status-bar/ngx';

@NgModule({
  declarations: [
    AppComponent
  ],
  entryComponents: [],
  imports: [BrowserModule,
      IonicModule.forRoot(),
      AppRoutingModule,
      AngularFireAuthModule,
      AngularFireDatabaseModule,
      AngularFirestoreModule,
      HomePageModule,
      MapasPageModule,
      ListadoPageModule,
      ContactoPageModule,
      AboutusPageModule,
      WebcatastroPageModule,
      FavoritosPageModule,
      EstadisticasPageModule,
      MicuentaPageModule,
      LoginPageModule,
      RegistrationPageModule,
      LogoutPageModule,
      ResetPasswordPageModule,
      TestPageModule,
      HttpClientModule,
      FormsModule,
    ],
  providers: [
    AngularFirestoreModule,
    AuthenticationService,
    StatusBar,
      { provide: RouteReuseStrategy, useClass: IonicRouteStrategy, }, 
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
