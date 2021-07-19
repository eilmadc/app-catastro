import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ParcelaPageRoutingModule } from './parcela-routing.module';

import { ParcelaPage } from './parcela.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ParcelaPageRoutingModule
  ],
  declarations: [ParcelaPage]
})
export class ParcelaPageModule {}
