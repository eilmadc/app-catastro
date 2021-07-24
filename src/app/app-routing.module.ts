import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'folder', 
    loadChildren: () => import('./folder/folder.module').then( m => m.FolderPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./components/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./components/login/registration/registration.module').then( m => m.RegistrationPageModule)
  },
  {
    path: 'parcela',
    loadChildren: () => import('./shared/pages/parcela/parcela.module').then( m => m.ParcelaPageModule)
  },
  {
    path: 'inmueble',
    loadChildren: () => import('./shared/pages/inmueble/inmueble.module').then( m => m.InmueblePageModule)
  },
  {
    path: 'mapa',
    loadChildren: () => import('./shared/pages/mapa/mapa.module').then( m => m.MapaPageModule)
  },
  {
    path: 'test',
    loadChildren: () => import('./components/test/test.module').then( m => m.TestPageModule)
  },
  {
    path: 'foto',
    loadChildren: () => import('./shared/pages/foto/foto.module').then( m => m.FotoPageModule)
  }
];


@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
