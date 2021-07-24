//
//
import { Injectable } from '@angular/core';
import { IonFooter, Platform } from '@ionic/angular';
import { Capacitor } from '@capacitor/core';
import { Camera, CameraResultType, CameraSource, CameraPhoto } from '@capacitor/camera';

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
    private FOTO_STORAGE: string = "fotos";

    //
    constructor(public plataforma: Platform){ }

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


    /*
        Hace una foto, la añade a |this.fotos| y vuelva la colección en LocalStorage.

        public async addNewToGallery() {
    */
    public async fotoHacer() {

        const imagen = await Camera.getPhoto(
            {
                resultType:     CameraResultType.Uri,               // file-based data; provides best performance
                source:         CameraSource.Camera,                // automatically take a new photo with the camera
                quality:        100,                                // La calidad esta entre [0, 100]
                //allowEditing:   true,                               // 
            });

        const imagenSalvar = await this.fotoGuardar(imagen);
        await (this.fotos.unshift(imagenSalvar))

        Storage.set({ 
            key:    this.FOTO_STORAGE,
            value:  JSON.stringify(this.fotos)
        });
    }


    /*
        Elimina una IFoto, |foto|, del Storage y actualiza |this.fotos|.

        @param  {IFoto} |foto| a borrar
        @param  {number} |posicion| donde se loclaliza la |foto|
    */
    public async fotoBorrar(foto: IFoto, posicion: number) {

        this.fotos.splice(posicion, 1);                                                     // borra la |foto| de la colección [fotos]

        Storage.set({                                                                       // reescribe localStorage con la colección [fotos]
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
            console.log(`deletePicture. Error, controlado, al eliminar ${nombreArchivo}; ${e}}`);
        }
    }


    /*
        Sube las fotos que se almacenadron en LocalStorage a |this.fotos|.s

    */
    public async fotosLoad() {

        const fotoList = await Storage.get({ key: this.FOTO_STORAGE });
        this.fotos = JSON.parse(fotoList.value) || [];

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
        Toma una foto, ó una imagen cargada desde el sistema de archivos en curso de la cámara, |camaraFoto|, y la vuelca en LocalStorage.

        @param {CameraPhoto} cameraPhoto

        @return {   
                    filepath:    {string} nombre del archivo con el que se guardo la imagen |cameraFoto|
                    webviewPath: {string} indica la uri donde se almaceno
                }
    */
    private async fotoGuardar(camaraFoto: CameraPhoto) {

        const base64Data = await this.blobABase64(camaraFoto);                      // fuerza la CameraPhoto en base64, por obligación de API.

        const fileName = new Date().getTime() + '.jpeg';
        const savedFile = await Filesystem.writeFile({
            path:       fileName,
            data:       base64Data,
            directory:  Directory.Data
        });

        if (this.plataforma.is('hybrid')) {                                           // la plataforma condiciona el destino
            return {
                filepath:       savedFile.uri,
                webviewPath:    Capacitor.convertFileSrc(savedFile.uri),
            };
        } else {                 
            return {
                filepath:       fileName,                                            
                webviewPath:    camaraFoto.webPath
            };
        }
    }


    /*
        Devuelve la coleccion de |this.fotos|,

        @return IFoto[], |this.fotos|
    */
    public fotosGet() {
        return this.fotos;
    }


    /*
        Devuelve un |IFoto| desde su |IFoto.filepath|.

        @param  {string} filepath 

        @return {IFoto} 
    */
    public fotoGet(fileName: string) {

        let foto: IFoto = null;

        for (var i= 0; i< this.fotos.length; i++){
            if (fileName == this.fotos[i].filepath) {
                foto = this.fotos[i];
                break;
            }
        }

        return foto;
    }



    /*
        Devuelve un objeto con las claves {filepath , webviewPath} del |cameraPhoto|.

        @param {CameraPhoto}, camaraFoto 
        @param {string}, fileName, el nombre del archivo

        @return {
                    filepath:    {string} nombre del archivo con el que se guardo la imagen |cameraPhoto|
                    webviewPath: {string} indica la uri donde se almaceno
                }
    */
    private async getFotoFile(cameraPhoto: CameraPhoto, fileName: string): Promise<IFoto> {
        return {
            filepath:       fileName,
            webviewPath:    cameraPhoto.webPath
        }
    }


    /*
        La |cameraPhoto| se devuelve como un base64

        @param  {CameraPhoto} camaraFoto, que debemos convertir a Blob 

        @return {Blob} blob, un archivo blob
    */
    private async blobABase64(cameraPhoto: CameraPhoto) {

        if (this.plataforma.is("hybrid")) {                                               // 
            const fichero = await Filesystem.readFile({ path: cameraPhoto.path });

            return fichero.data;

        } else {                                                                        // 
            const response = await fetch(cameraPhoto.webPath!);
            const blob = await response.blob();

            return await this.convertirBlobABase64(blob) as string;
        }
    }
}