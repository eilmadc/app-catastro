//
//
import { Component, OnInit } from '@angular/core';
import { ActionSheetController } from '@ionic/angular';

import { CamaraService } from 'src/app/shared/services/camara.service';
import { CatastroService } from 'src/app/shared/services/catastro/catastro.service';
import { IFoto } from 'src/app/shared/interfaces/foto.modelo';
import { IMarkilo } from '../../shared/interfaces/catastro.modelos';

//
//
@Component({
                    selector:       'app-camara',
                    templateUrl:    './camara.page.html',
                    styleUrls:      ['./camara.page.scss'],
                })

//
//
export class CamaraPage implements OnInit {

    //
    constructor(public camaraServicio: CamaraService,
                public actionSheetController: ActionSheetController,
                public catastroServicio: CatastroService) {
    }

    //
    async ngOnInit() {
        await this.camaraServicio.fotosLoad();
    }


    /*
        Hace una foto, ni más nimenos.

    */
    fotoHacer() {
        this.camaraServicio.fotoHacer();
    }


    /*
        Consulta si la IFoto esta asignada a algun IMarkilo.

        @param  {string} 

        @return {booelan} indica si |foto| ha sido localizado en la colección de markilos.

    */
    public async fotoEstaEnMarkilos(foto: IFoto): Promise<boolean> {

        let rBoolean: boolean = false;

        await this.catastroServicio.markilosLoad();
        let markilos: IMarkilo[] = this.catastroServicio.markilosGet();

        for (var i= 0; i < markilos.length; i++) {

            if (markilos[i].foto) {
                if (markilos[i].foto.filepath == foto.filepath)
                    rBoolean = true;
                    break;
            }
        }

        return rBoolean;
    }


    /*
        Opciones para la foto Seleccionada [Asignar|Borrar|Cancelar]

        @param  {IFoto}
        @param  {number} posicion 

    */
    public async btImagenMostrarAcciones(foto: IFoto, posicion: number) {

        const actionSheet =
            
            await this.actionSheetController.create({
                
                header: 'Fotos',
                buttons:    [{
                                text: 'Borrar',
                                role: 'destructive',
                                icon: 'trash',
                                 handler: () => {   if (!this.fotoEstaEnMarkilos(foto)) {                                                        
                                                        this.camaraServicio.fotoBorrar(foto, posicion);
                                                        location.reload();
                                                    }
                                                }
                            }, {
                                text: 'Cancelar',
                                role: 'cancel',
                                icon: 'close',
                                handler: () => { }
                            }]
            });

        await actionSheet.present();
    }
}
