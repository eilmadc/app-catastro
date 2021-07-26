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

//Components
import { AppComponent } from './app.component';
import { LoginPageModule } from './components/login/login.module'
import { HomePageModule } from './folder/home/home.module';
import { MapasPageModule } from './folder/mapas/mapas.module';
import { ListadoPageModule } from './folder/listado/listado.module';
import { ContactoPageModule } from './folder/contacto/contacto.module';
import { AboutusPageModule } from './folder/aboutus/aboutus.module';
import { WebcatastroPageModule} from './folder/webcatastro/webcatastro.module'
import { RegistrationPageModule } from './components/login/registration/registration.module';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

// Acceder a Catastro
import { HttpClientModule } from '@angular/common/http';
import { LogoutPageModule } from './components/login/logout/logout.module';
import { ResetPasswordPageModule } from './components/login/reset-password/reset-password.module';
import { FavoritosPageModule } from './folder/favoritos/favoritos.module';
import { TestPageModule } from './components/test/test.module';

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
      LoginPageModule,
      RegistrationPageModule,
      LogoutPageModule,
      ResetPasswordPageModule,
      TestPageModule,
      HttpClientModule,
    ],
  providers: [AngularFirestoreModule,
      { provide: RouteReuseStrategy, useClass: IonicRouteStrategy, }, 
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
