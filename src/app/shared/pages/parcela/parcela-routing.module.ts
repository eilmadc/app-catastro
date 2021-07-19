import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ParcelaPage } from './parcela.page';

const routes: Routes = [
  {
    path: '',
    component: ParcelaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ParcelaPageRoutingModule {}
