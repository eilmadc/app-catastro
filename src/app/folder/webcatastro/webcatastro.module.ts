import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WebcatastroPageRoutingModule } from './webcatastro-routing.module';

import { WebcatastroPage } from './webcatastro.page';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WebcatastroPageRoutingModule,
    HttpClientModule 
  ],
  declarations: [WebcatastroPage]
})
export class WebcatastroPageModule {}
