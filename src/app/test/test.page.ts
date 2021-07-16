//
//
import { Component, OnInit } from '@angular/core';

interface coordenada {
    latitud:    number,
    longitud:   number,
    desc:       string
}

//
//
@Component({
                    selector: 'app-test',
                    templateUrl: './test.page.html',
                    styleUrls: ['./test.page.scss'],
                })

//
//
export class TestPage implements OnInit {

    //
    public coordenadas: coordenada[] = [
        {
            latitud: 40.92465644496646,
            longitud: 0.8414186666402872,
            desc: 'Casa Cruz Gamada (Tarragona)'                        // es Parcela
        },
        {
            latitud: 40.41634264194055,
            longitud: -3.6966086663337605,
            desc: 'Congreso de los Diputados (Madrid)'                  // es Inmueble
        },
    ]

    //
    constructor() { }

    //
    ngOnInit() {

        alert('aqui');
    }



}
