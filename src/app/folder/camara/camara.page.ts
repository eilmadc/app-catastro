//
//
import { Component, OnInit, Input } from '@angular/core';
import { ActionSheetController, AlertController } from '@ionic/angular';

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

    @Input() fotos: IFoto[] = []

    //
    constructor(    public actionSheetController: ActionSheetController,
                    public alertController: AlertController,
                    public camaraServicio: CamaraService,
                    public catastroServicio: CatastroService) { }   

    //
    async ngOnInit() {
        await this.camaraServicio.fotosLoad();
        this.fotos = await this.camaraServicio.fotosGet();
    }

    async ngOnDestroy() {
        await this.camaraServicio.fotosLoad();
        await this.camaraServicio.fotosGet();
    }


    /*
        Hace una foto, ni más nimenos.

    */
    async fotoHacer() {
        await this.camaraServicio.fotoHacer();
    }


    /*
        Opciones para la foto Seleccionada [Asignar|Borrar|Cancelar]

        @param  {IFoto}
        @param  {number} posicion 
    */
    public async btImagenMostrarAcciones(foto: IFoto, posicion: number) {

        const actionSheet = await this.actionSheetController.
            create({
                header:     'Fotos',
                buttons:    [{
                                text: 'Borrar',
                                role: 'destructive',
                                icon: 'trash',
                                handler: () => {    this.fotoEliminarSiEsPosible(foto, posicion) }
                            }, {
                                text: 'Cancelar',
                                role: 'cancel',
                                icon: 'close',
                                handler: () => {    /* */ }
                            }]
            });

        await actionSheet.present();
    }


    /*
        Intentara eliminar la |foto| si no esta asignada a ningun markilo.

    */
    public async fotoEliminarSiEsPosible(foto: IFoto, posicion: number) {

        let markiloId: string = await this.fotoEstaEnMarkilos(foto);

        if (!markiloId) {
            await this.camaraServicio.fotoBorrar(foto, posicion);
            await this.msgInformacion(  'Información',
                                        'Orden de Borrado',
                                        'La imagén fue borrada');            
            location.reload();

        } else {

            await this.msgInformacion(  'Información',
                                        'Orden de Borrado',
                                        'No se borrará la imagen seleccionada porque la tiene asignada un Markilo.');
        }
    }


    /*
        Consulta si la IFoto esta asignada a algun IMarkilo; IFoto.filepath = IMarkilo.foto.filepath

        @param  {IFoto} foto a buscar en |this.markilos|

        @return {string} markiloId --que es markilo.id-- del |IMarkilo| que lo tiene asignado, al menos el primero de |this.markilos|.
    */
    public async fotoEstaEnMarkilos(foto: IFoto): Promise<string> {

        let markiloId: string = null;

        await this.catastroServicio.markilosLoad();
        let markilos: IMarkilo[] = await this.catastroServicio.markilosGet();

        for (var i = 0; i < markilos.length; i++) {
            
            if (markilos[i].foto) {

                if ( markilos[i].foto.filepath === foto.filepath ){
                    markiloId = markilos[i].id;
                    break;
                }
            } 
        }

        return markiloId;
    }


    /*
        Mensaje informando que no se borra el archivo propuesto porque ya está asignado, al menos, a un Markilo.
    */
    async msgInformacion(titulo: string, subtitulo: string, texto: string) {
        const alert = await this.alertController.create({
            cssClass:   'my-custom-class',
            header:     titulo,
            subHeader:  subtitulo,
            message:    texto,
            buttons:    ['OK']
        });

        await alert.present();
        //const { role } = await alert.onDidDismiss();
        //console.log('onDidDismiss resolved with role', role);
    }
}
