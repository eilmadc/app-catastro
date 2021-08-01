//
//
import { Injectable } from '@angular/core';

import { CatastroService } from '../../shared/services/catastro/catastro.service'
//import { IReturnReferenciaCatastral } from '../../shared/interfaces/catastro.modelos'

//
//
@Injectable({
                    providedIn: 'root'
                })

//
//
export class MapasService {

    //
    constructor(    public catastroServicio: CatastroService) { }

    //
    async jp(latitud: number, longitud: number): Promise<String> {

        let irrc = await this.catastroServicio.getRCCOOR(latitud, longitud);

        const id = await this.catastroServicio.markiloGenerateSave(latitud, longitud, irrc);

        return id
    }
}
