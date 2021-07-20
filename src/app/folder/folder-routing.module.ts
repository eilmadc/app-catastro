import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FolderPage } from './folder.page';

const routes: Routes = [
  {
    path: '',
    component: FolderPage,
    children:[
      {
        path: 'home',
        loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
      },
      {
        path: 'mapas',
        loadChildren: () => import('./mapas/mapas.module').then( m => m.MapasPageModule)
      },
      {
        path: 'listado',
        loadChildren: () => import('./listado/listado.module').then( m => m.ListadoPageModule)
      },
      {
        path: 'camara',
        loadChildren: () => import('./camara/camara.module').then( m => m.CamaraPageModule)
      },
      {
        path: 'consultas',
        loadChildren: () => import('./consultas/consultas.module').then( m => m.ConsultasPageModule)
      },
      {
        path: 'aboutus',
        loadChildren: () => import('./aboutus/aboutus.module').then( m => m.AboutusPageModule)
      },
      {
        path: 'contacto',
        loadChildren: () => import('./contacto/contacto.module').then( m => m.ContactoPageModule)
      },
      {
        path: 'webcatastro',
        loadChildren: () => import('./webcatastro/webcatastro.module').then( m => m.WebcatastroPageModule)
      },
        ]
  },
  {
    path: 'notifications',
    loadChildren: () => import('./notifications/notifications.module').then( m => m.NotificationsPageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FolderPageRoutingModule {}
