import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WebcatastroPage } from './webcatastro.page';

const routes: Routes = [
  {
    path: '',
    component: WebcatastroPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WebcatastroPageRoutingModule {}
