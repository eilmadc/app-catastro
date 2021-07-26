//
//
import { Injectable, ɵAPP_ID_RANDOM_PROVIDER } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Capacitor } from '@capacitor/core';
import { Camera, CameraResultType, CameraSource, CameraPhoto, Photo} from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Storage } from '@capacitor/storage';

import { IFoto } from '../interfaces/foto.modelo';


//
//
@Injectable({
                    providedIn: 'root'
                })

//
//
export class CamaraService {

    //
    public fotos: IFoto[] = [];
    public fotox: string[] = [];

    private FOTO_STORAGE: string = "fotos";

    //
    constructor(public plataforma: Platform){ }


    /*
        Hace una foto, la añade a |this.fotos| y vuelca la colección en Storage.

    */
    public async fotoHacer() {
        
        var bien: boolean = false;

        const foto = await Camera.getPhoto({
            resultType:     CameraResultType.Uri,
            source:         CameraSource.Camera,
            allowEditing:   true,
            quality:        100
        }).then(acierto, fracaso);

            function fracaso(error: any) {
                alert(`mal muy mal: ${error}`)
                return error}

            function acierto(respuesta: Photo) {
                bien = true;
                return respuesta; }

        if (bien) {
            const saveImageFile = await this.fotoGuardar(foto);
            
            this.fotos.unshift(saveImageFile);

            await Storage.set({ key:    this.FOTO_STORAGE,
                                value:  JSON.stringify(this.fotos), });            
        }
    }


    /*
          Toma una foto, ó una imagen cargada desde el sistema de archivos en curso de la cámara, |camaraFoto|, y la vuelca en LocalStorage.
  
          @param {CameraPhoto} cameraPhoto
  
          @return {   
                      filepath:    {string} nombre del archivo con el que se guardo la imagen |cameraFoto|
                      webviewPath: {string} indica la uri donde se almaceno
                  }
      */    
    private async fotoGuardar(cameraPhoto: CameraPhoto) {

        const base64Data = await this.blobABase64(cameraPhoto);                      // fuerza la CameraPhoto a base64, por obligación de API.

        const fotoNombre = new Date().getTime() + '.jpeg';
        const archivo = await Filesystem.writeFile({    path:       fotoNombre,
                                                        data:       base64Data,
                                                        directory:  Directory.Data  });

        if (this.plataforma.is('hybrid')) {                                           // la plataforma condiciona el destino
            alert(`Capacitor.convertFileSrc`)
            alert(Capacitor.convertFileSrc)
            return {    filepath:       archivo.uri,
                        webviewPath:    Capacitor.convertFileSrc(archivo.uri), };

        } else {
            alert(`cameraPhoto.webPath`)
            alert(cameraPhoto.webPath)
            return {    filepath:       fotoNombre,               
                        webviewPath:    cameraPhoto.webPath, };
        };
    }


    /*
        Elimina una IFoto, |foto|, del Storage y actualiza |this.fotos|.

        @param  {IFoto} |foto| a borrar
        @param  {number} |posicion| donde se loclaliza la |foto|
    */
    public async fotoBorrar(foto: IFoto, posicion: number) {

        console.log(this.fotos)
        await this.fotos.splice(posicion, 1);                         // borra la |foto| de la colección [fotos]
        console.log(this.fotos)

        await Storage.set({                                     // reescribe Storage con la colección [fotos]
            key:    this.FOTO_STORAGE,
            value:  JSON.stringify(this.fotos)
        });
        
        const nombreArchivo = foto.filepath.substr(foto.filepath.lastIndexOf('/') + 1);
        try {                                                                               
            await Filesystem.deleteFile({
                path:       nombreArchivo,
                directory:  Directory.Data
            });
        } catch (e) {
            alert(`${nombreArchivo}; ${e}`)
            console.log(`deletePicture. Error, controlado, al eliminar ${nombreArchivo}; ${e}}`);
        }
    }

  
    /*
        Devuelve un |IFoto| desde su |IFoto.filepath|.

        @param  {string} filepath 

        @return {IFoto} 
    */
    public fotoGet(fileName: string) {

        let foto: IFoto = null;

        for (var i = 0; i < this.fotos.length; i++) {
            if (fileName == this.fotos[i].filepath) {
                foto = this.fotos[i];
                break;
            }
        }

        return foto;
    }


    /*
        Devuelve la coleccion de |this.fotos|.

        @return IFoto[], |this.fotos|
    */
    public fotosGet() {
        return this.fotos;
    }


    /*
        Sube las fotos que se almacenadron en Capacitor.Storage a |this.fotos|.

    */
    public async fotosLoad() {

        const fotos = await Storage.get({ key: this.FOTO_STORAGE });
        this.fotos = JSON.parse(fotos.value) || [];
        
        if (!this.plataforma.is('hybrid')) {
            for (let foto of this.fotos) {
                const leerFile = await Filesystem.readFile({
                    path:       foto.filepath,
                    directory:  Directory.Data
                });
                foto.webviewPath = `data:image/jpeg;base64,${leerFile.data}`;
            }
        }
    }

    
    /*
        La |cameraPhoto| se devuelve como un base64

        @param  {CameraPhoto} camaraFoto, que debemos convertir a Blob 

        @return {Blob}, la |cameraPhoto| en base64
    */
    private async blobABase64(cameraPhoto: CameraPhoto) {

        if (this.plataforma.is("hybrid")) {
            const fichero = await Filesystem.readFile({ path: cameraPhoto.path });

            return fichero.data;

        } else {                                             
            const response = await fetch(cameraPhoto.webPath!);
            const blob = await(response.blob());

            return await this.convertirBlobABase64(blob) as string;
        }
    }


    /*  
        Convierte el |blob| a base64

        @param  {Blob} blob a convertir
    */
    convertirBlobABase64 =
        (blob: Blob) =>
            new Promise((resolve, reject) => {

                const fileReader = new FileReader;
                fileReader.onerror = reject;
                fileReader.onload = () => {
                    resolve(fileReader.result);
                };
                fileReader.readAsDataURL(blob);
            });
}