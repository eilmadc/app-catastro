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
export class GeolocalizacionService {

    //
    constructor() { }
    /*
        ver _coordenadas()
    */
    coorGoogle(latitud: number, longitud: number) {
        return this._coordenadas('GOOGLE-MAP', latitud, longitud); }

    /*
        ver _coordenadas()
    */
    coorMapBox(latitud: number, longitud:number) {
        return this._coordenadas('MAP-BOX', latitud, longitud); }

    /*
        Devuelve las coordenadas, |latitud| y |longitud|, en el orden que se indica en |sistema|, (['GOOGLE-MAP']|'MAP-BOX').

        En 'GOOGLE-MAP' las coordenadas de |latitud| antes que las de |longitud|.
        Para 'MAP-BOX' siempre |longitud| antes que |latitud|.

        @param  {number} latitud, responde a la coordenada de la latitud
        @param  {number} longitud, responde a la coordenada de longitud

        @return {array} en el que la primera coordenada se ajusta al orden del |sistema|-
    */
    _coordenadas(sistema: string, latitud: number, longitud: number) {

        let coordenadas = [0, 0];

        switch (sistema) {
            case 'MAP-BOX':
                coordenadas[0] = longitud,
                coordenadas[1] = latitud
                break;

            case 'GOOGLE-MAP':
            default:
                coordenadas[0]  = latitud,
                coordenadas[1]  = longitud
        }
        return (coordenadas[0], coordenadas[1])
    }
}