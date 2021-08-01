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
        Es la funcion para obtener las coordenadas, según el orden de GOOGLE-MAP, contenidas en un objeto de geolocalización |Position|.

        @goTo   coorGoogle()

        @param  {number} longitud, responde a la coordenada de longitud
        @param  {number} latitud, responde a la coordenada de la latitud

        @return {Position} position, es el emboltorio para las coordenadas dadas.
    */
    coordenadas(latitud: number, longitud: number) {

        //let coordenadas = this.coorGoogle(latitud, longitud);
        //console.log(coordenadas)
    
        //this.position.coords.latitude = c[0];
        //this.position.coords.longitude = c[1];
        //return this.position; 
        return this.coorGoogle(latitud, longitud)
    }


    /*
        Devuelve las coordenadas en el orden apropiado para ser usadas con GOOGLE-MAP.

        @goTo   coorGoogle()

        @param  {number} longitud, responde a la coordenada de longitud
        @param  {number} latitud, responde a la coordenada de la latitud

        @return {array} en el que la primera coordenada se ajusta al orden de GOOGLE-BOX
    */

    coorGoogle(latitud: number, longitud: number) {
        return this.__coordenadas('GOOGLE-MAP', latitud, longitud); }


    /*
        Devuelve las coordenadas en el orden apropiado para ser usadas con MAP-BOX.
        
        @goTo   coorGoogle()

        @param  {number} longitud, responde a la coordenada de longitud
        @param  {number} latitud, responde a la coordenada de la latitud

        @return {array} en el que la primera coordenada se ajusta al orden de MAP-BOX
    */
    coorMapBox(latitud: number, longitud:number) {
        return this.__coordenadas('MAP-BOX', latitud, longitud); }


    /*
        Devuelve las coordenadas, |latitud| y |longitud|, en el orden que se indica en |sistema|, (['GOOGLE-MAP']|'MAP-BOX').

        En 'GOOGLE-MAP' las coordenadas de |latitud| antes que las de |longitud|.
        Para 'MAP-BOX' siempre |longitud| antes que |latitud|.

        @param  {number} latitud, responde a la coordenada de la latitud
        @param  {number} longitud, responde a la coordenada de longitud

        @return {array} en el que la primera coordenada se ajusta al orden del |sistema|-
    */
    __coordenadas(sistema: string, latitud: number, longitud: number) {

        let arrCoordenadas = [];

        switch (sistema) {
            case 'MAP-BOX':
                arrCoordenadas[0] = longitud,
                arrCoordenadas[1] = latitud
                break;

            case 'GOOGLE-MAP':
            default:
                arrCoordenadas[0]  = latitud,
                arrCoordenadas[1]  = longitud
        }
        return arrCoordenadas;
    }
}