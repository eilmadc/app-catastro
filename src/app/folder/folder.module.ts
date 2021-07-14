import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FolderPageRoutingModule } from './folder-routing.module';

import { FolderPage } from './folder.page';
import { HomePageModule } from './home/home.module';
import { MapasPageModule } from './mapas/mapas.module';
import { ListadoPageModule } from './listado/listado.module';
import { ConsultasPageModule } from './consultas/consultas.module';
import { CamaraPageModule } from './camara/camara.module';
import { ContactoPageModule } from './contacto/contacto.module';
import { AboutusPageModule } from './aboutus/aboutus.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FolderPageRoutingModule,
    HomePageModule,
    MapasPageModule,
    ListadoPageModule,
    ConsultasPageModule,
    CamaraPageModule,
    ContactoPageModule,
    AboutusPageModule,
  ],
  declarations: [FolderPage]
})
export class FolderPageModule {}
