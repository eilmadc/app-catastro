import { Component, OnInit } from '@angular/core';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

@Component({
  selector: 'app-webcatastro',
  templateUrl: './webcatastro.page.html',
  styleUrls: ['./webcatastro.page.scss'],
})
export class WebcatastroPage implements OnInit {

  constructor(
    public iab: InAppBrowser
  ) { }

  ngOnInit() {
    this.iab.create(`https://www1.sedecatastro.gob.es/Cartografia/mapa.aspx?buscar=S`, `_self`,Option);
    
  }

//Abrir link Catastro en navegador con InAppBrowser
  //Lo abro con boton
 async openUrl() {

  } 

}
