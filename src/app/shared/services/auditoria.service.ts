//
//
import { Injectable } from '@angular/core';

//
//
@Injectable({
                providedIn: 'root'
            })

//
//
export class AuditoriaService {

    //
    constructor() { }






    
    /*
        Genera un tracker de las peticiones al catastro 
    */
    async test__CrearTracker_en_localStorage() {

        let preTrackers = [
            { 
                orden:      1,                                                              
                instante:   '2016/07/16 12:52:09',
                latitud:    40.92465644496646,
                longitud:   0.8414186666402872,
                marcador:   false,
                resultado:  true,
            }, {                                                               
                orden:      2,
                instante:   '2017/07/16 00:53:09',
                latitud:    40.41634264194055,
                longitud:   -3.6966086663337605,
                marcador:   false,
                resultado:  true,
            },
            {                               
                orden:      3,                                
                instante:   '2019/11/02 11:53:09',
                latitud:    39.47439226625097,
                longitud:   -0.37831976528385386,
                marcador:   false,
                resultado:  true,
            },
            {             
                orden:      4,
                instante:   '2020/11/02 11:03:09',
                latitud:    42.880626849444305,
                longitud:   -8.544646314889821,
                marcador:   true,
                resultado:  true,
            },
            {                                                               
                orden:      5,
                instante:   '2018/11/02 10:53:09',
                latitud:    41.40356145365357,
                longitud:   2.1744767782584358,
                marcador:   true,
                resultado:  true,
            },
            {                                                               
                orden:      6,
                instante:   '2021/05/03 09:53:09',
                latitud:    37.878843641773095,
                longitud:   -4.779620226997026,
                marcador:   true,
                resultado:  true,
            },
            {                                                               
                orden:      7,
                instante:   '2021/01/03 09:59:03',
                latitud:    37.17609897963017,
                longitud:   -3.588145285711672,
                marcador:   true,
                resultado:  true,
            },
            {   
                orden:      8,
                instante:   '2021/05/03 11:03:03',
                latitud:    37.386348853983016,
                longitud:   -5.992602966276505,
                marcador:   true,
                resulatdo:  true,
            },
            {                  
                orden:      9,
                instante:   '2020/05/03 11:13:09',
                latitud:    40.927409337781576,
                longitud:   0.8392742549965533,
                marcador:   false,
                resultado:  false,
            },
            {                    
                orden:      10,
                instante:   '2020/07/16 12:01:09',
                latitud:    40.928752005582545,
                longitud:   0.8503738259575321,
                marcador:   false,
                resultado:  true,
            }
        ];

        
        for (var i = 0; i < preTrackers.length; i++) {

            const fecha = new Date((preTrackers[i].instante));
            let ano = fecha.getFullYear()

            console.log(`${preTrackers[i].instante} --- ${ano}`)




        }
        

    }
}
