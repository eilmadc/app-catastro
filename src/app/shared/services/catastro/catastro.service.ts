//
//
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
//import { Storage } from '@capacitor/storage';

import {    IParcela, IParcelaInmuebles,
            IInmueble, IInmuebleConstruccion,
            IReturnReferenciaCatastral, IReturnModeloCatastro,
            IMarkilo } from '../../interfaces/catastro.modelos';

//
//
@Injectable({
                    providedIn: 'root'
                })

//
//
export class CatastroService {
    
    //
    private markilos: IMarkilo[] = [];

    //
    constructor(    private httpClient: HttpClient) { }
    

    /*
        Añade un nuevo |markilo| a las colección de |this.markilos|
    */
    markiloAdd(markilo: IMarkilo) {
        this.markilos.push(markilo);
    }


    /*
        Devuelve el Markilo de |this.markilos| con el |markilo.id|.

        @param  {string} id 

        @return {Markilo}, rtnMarkilo ... con el |id| solicitada.
    */
    markiloGetId(markiloId: string): IMarkilo {

        let rtnMarkilo: IMarkilo;

        for (var i = 0; i < this.markilos.length; i++) {
            if (this.markilos[i].id == markiloId) {
                rtnMarkilo = this.markilos[i]
                break;
            }
        }

        return rtnMarkilo;
    }


    /*
        Devuelve el Markilo que responde a |referenciaCatastral| en |this.markilos|.
        @param  {string} referenciaCatastral, responde a uno de los Markilos de la colección markilos.
        @return {Markilo}, rtnMarkilo ... con la |referenicaCatastral| solicitada.
    */
    markiloGet(referenciaCatastral: string): IMarkilo {

        let rtnMarkilo: IMarkilo;
        
        for (var i= 0; i< this.markilos.length; i++) {
            if ( this.markilos[i].irmc.modeloCatastro.rcParcela == referenciaCatastral ) {
                rtnMarkilo = this.markilos[i]
                break;
            }
        }

        return rtnMarkilo;
    }


    /*
        Salva el |markilo| en |this.markilos| y en LocalStorage, si existe lo reeemplaza y sino lo reescribe.
        @param {Markilo}, markilo a salvar.
    */
    async markiloSet(markilo: IMarkilo) {

        await localStorage.setItem(markilo.id, JSON.stringify(markilo));

        for (var i = 0; i < this.markilos.length; i++) {
            if  ( this.markilos[i].id == markilo.id ) {
                this.markilos[i].id =  await markilo.id;
                break;
            }
        }
    }


    /*
        Devuelve la coleccion de en markilos y registrados en localStorage, pero no los carga pues se delega en la instruccion loadMarkilos(). 
        Puede pedirse una matriz unicamente con los que estan como |markilo.favorito|.

        // TODO
        // recordar de hacerlo de firebase si es firebase donde se guardan.

        @param  {boolean} favoritos, si es True devolvera una matriz de IMarkilos solo con los que son |markilo.favorito|.

        @return IMarkilos[]
    */
    markilosGet(favoritos: boolean = false): IMarkilo[] {

        let markilos: IMarkilo[] = this.markilos;

        if (favoritos == true) {
            markilos = markilos.filter( (markilo) => (markilo.favorito));
        }

        return markilos;
    }


    /*
        Salva la colección de |this.markilos| a localStorage, LS.
        // TODO
        // recordar de hacerlo de firebase si es firebase donde se guardan.
    */
    async markilosSave() {

        await this.markilosClear();

        for (var i = 0; i< this.markilos.length; i++) {
            await localStorage.setItem(this.markilos[i].id, JSON.stringify(this.markilos[i]));
        }
    }


    /* 
        Carga la coleccion de Markilos registrados en localStorage a this.markilos.
        // TODO
        // recordar de hacerlo de firebase si es firebase donde se guardan.
    */
    async markilosLoad() {

        this.markilos = [];

        /* rellena la matriz para visualizar en el tab */
        for (var i = 0; i < localStorage.length; i++) {

            let k = localStorage.key(i);            
            if (k.search(/\d{4}\/\d{2}\/\d{2}/) == 0 ) {
                let mkl: IMarkilo = await JSON.parse(localStorage.getItem(k));
                this.markilos.push(mkl);
            }
        }
        this.markilos.sort((a, b) => b.id.localeCompare(a.id));
    }


    /*
        Vacia la coleccion de Markilos registrados en localStorage, LS.
        
        // TODO
        // recordar de hacerlo de firebase si es firebase donde se guardan.
    */
    async markilosClear() {
        for (var i = 0; i < localStorage.length; i++) {
            let k = localStorage.key(i);
            if (k.search(/\d{4}\/\d{2}\/\d{2}/) == 0) {
                localStorage.removeItem(k);
            }
        }
    }

    
    /* 
        Deuelve una matriz con los IInmuebles encontrados en el |modeloCatastral| llegado, (IParcela|IInumueble). Si |modeloCatastral| es ya un Inmueble
        lo devuelve como unico elemento de la matriz, y si es una (IParcela) consulta en el catastro y devuelve todos los Inmueble's que tenga la Parcela.
        @param  {(IParcela|IInumueble)} modeloCatastral para extraer los IInumuebles
        @return {Array}, arrInmuebles
    */
    async getInmuebles(ModeloCatastral: any): Promise<any> {

        let arrIInmuebles = [];

        if ( this.esParcela(ModeloCatastral) == true ) {                                          // ... es una Parcela
                                                                                   
            for (var x = 0; x < ModeloCatastral.parcelaInmuebles.length; x++) {
                let rmc = await this.getDNPRC(ModeloCatastral.parcelaInmuebles[x].rcInmueble);      // esto devuelve un IInmueble ... SEGURO
                arrIInmuebles.push(rmc.modeloCatastro);
                //console.log('Parcela/Inmueble');
                //console.log(rmc.modeloCatastro);
            }
        } else {                                                                    // ... es una Inmueble
            arrIInmuebles.push(ModeloCatastral);
            //console.log('Inmueble/Inmueble');
            //console.log(ModeloCatastral);
        }

        return arrIInmuebles;
    }

    /* 
        Deuelve un boolean si el |ModeloCatastral| llegado, (IParcela|IInumueble), es una IParcela.
        @param  {(IParcela|IInumueble)} modeloCatastral a examinar
        @return {boolean},  true si lo es y 
                            false en caso contrario
    */
    esParcela(ModeloCatastral: any): any {
        return (ModeloCatastral.rcInmueble) ? false: true;
    }


    /*
        + Proporciona un ??? con la información pce devuelve "Consulta_RCCOOR_Distancia"; pcpartir de unas coordenadas (X e Y) y su sistema de referencia 
        se obtiene la referencia catastral de la parcela localizada en ese punto así como el domicilio (municipio, calle y número o polígono, pc1, pc2parcela y 
        municipio). En caso de no encontrar ninguna referencia catastral en dicho punto, se buscará en un área cuadrada de 50 metros de lado, centrada 
        en dichas coordenadas, y se devolverá la lista de referencias catastrales encontradas en dicha área.
        + La url es "http://ovc.catastro.meh.es/ovcservweb/OVCSWLocalizacionRC/OVCCoordenadas.asmx/Consulta_RCCOOR_Distancia"
        + Y la estructura que devuelve es;
            ----- Si todo ha ido bien
            <consulta_coordenadas_distancias>
                <control>
                    <cucoor>NÚMERO DE ITEMS EN LA LISTA COORDENADAS</cucoor>
                    <cuerr>NÚMERO DE ITEMS EN LA LISTA DE ERRORES</cuerr>
                </control>
                
                <coordenadas_distancias>LISTA DE COORDENADAS
                    <coordd> COORDENADA
                        <geo>
                            <xcen> COORDENADA X SOLICITADA </xcen>
                            <ycen> COORDENADA Y SOLICITADA </ycen>
                            <srs>SISTEMA DE REFERENCIA (POR EJEMPLO EPSG:23030)</srs>
                        </geo>
                    
                        <lpcd>LISTA DE REFERENCIAS CATASTRALES
                            <pcd>
                                <pc>
                                    REFERENCIA CATASTRAL
                                    <pc1>POSICIONES 1-7 DE LA REFERENCIA CATASTRAL (RC) DEL INMUEBLE</pc1>
                                    <pc2>POSICIONES 8-14 DE LA RC DEL INMUEBLE</pc1>
                                </pc>
                                <dt>Domicilio tributario
                                    <loine>Localización según INE
                                        <cp>Código INE de Provincia</cp>
                                        <cm>Código INE de Municipio</cm>
                                    </loine>
                                    <lourb>Localización urbana
                                        <dir>Dirección
                                            <cv> Código de vía</cv>
                                            <pnp>Primer número de policía</pnp>
                                            <plp>Letra del primer número de policía</plp>
                                        </dir>
                                    </lourb>
                                </dt>
                                <ldt>DIRECCIÓN (CALLE, NÚMERO, MUNICIPIO O POLÍGONO, PARCELA Y MUNICIPIO) DE LA PARCELA</ldt>
                                <dis>Distancia</dis>
                            </pcd> --- 
                            </pcd> --- esta etiqueta esta cerrada dos veces ! ... aunque no creo q afecte al final. Veremos.
                        </lpcd>
                    </coordd>
                </coordenadas_distancias>
            </consulta_coordenadas_distancias>
        @param  {number} latitud, responde a la coordenada de la latitud
        @param  {number} longitud, responde a la coordenada de longitud
 
        @return {???} con el contenido de la respuesta
     */
    async getRCCOOR_Distancia(latitud: number, longitud: number): Promise<any> {
        return await this._getCatastroRCCOOR('RCCOOR_Distancia', latitud, longitud); }


    /*
        + Proporciona un || con la información que devuelve "Servicio de consulta de Referencia Catastral por Coordenadas". A partir de unas 
        coordenadas (X, es longitud, e Y es la latitud) y su sistema de referencia se obtiene la referencia catastral de la parcela localizada en 
        ese punto así como el domicilio (municipio, calle y número o polígono, parcela y municipio).
        + La url es; http://ovc.catastro.meh.es/ovcservweb/OVCSWLocalizacionRC/OVCCoordenadas.asmx?op=Consulta_RCCOOR
        + Y la estructura que devuelve es;
            ----- Si hay algo en las coordenadas indicadas.
            <consulta_coordenadas>
                <control>
                    <cucoor>NÚMERO DE ITEMS EN LA LISTA COORDENADAS</cucoor>    // entiendo que solo puede ser =1
                    <cuerr>NÚMERO DE ITEMS EN LA LISTA DE ERRORES</cuerr>       // ?
                </control>
                <coordenadas>LISTA DE COORDENADAS
                    <coord>COORDENADA
                        <pc>REFERENCIA CATASTRAL
                            <pc1>POSICIONES 1-7 DE LA REFERENCIA CATASTRAL (RC) DEL INMUEBLE</pc1>
                            <pc2>POSICIONES 8-14 DE LA RC DEL INMUEBLE</pc1>
                        </pc>
                        <geo>
                            <xcen>COORDENADA X SOLICITADA</xcen>
                            <ycen>COORDENADA Y SOLICITADA</ycen>
                            <srs>SISTEMA DE REFERENCIA (POR EJEMPLO EPSG:23030)</srs>
                        </geo>
                        <ldt>DIRECCIÓN (CALLE, NÚMERO, MUNICIPIO O POLÍGONO, PARCELA Y MUNICIPIO) DE LA PARCELA</ldt>
                    </coord>
                </coordenadas>
            </consulta_coordenadas>
            ----- Si no hay nada en las coordenadas indicadas. Eg; las vias del tren.
            <consulta_coordenadas>
                <control>
                    <cucoor>0</cucoor>
                    <cuerr>1</cuerr>                                            // err
                </control>
                <lerr>
                    <err>
                        <cod>ERROR_NUMERO</cod>
                        <des>ERROR_DESCRIPCION</des>
                    </err>
                </lerr>
            </consulta_coordenadas>
        @param  {number} latitud, responde a la coordenada de la latitud
        @param  {number} longitud, responde a la coordenada de longitud
        @return IReturnReferenciaCatastral {
                    {number} numEstado (-1|0|>0) =-1 se ha producido un error, =0 no hay nada en esa posicion, =1 con la referencia y >0 no se espera.
                    {string} strReferenciaCatastral, si fue un exito concatena 'pc1' + 'pc1'. Que responden solo a la Parcela, no al Inmueble.
                    {XMLDocument] xmlDoc que ha recibido, lo devuelve para su auditoria.
                }
    */
    async getRCCOOR(latitud: number, longitud: number): Promise<any> {

        console.log('catastro gps');

        let numEstado: number;
        let strReferenciaCatastral: string = '';

        let iReturnReferenciaCatastral: IReturnReferenciaCatastral;

        const xmlDoc = await this._getCatastroRCCOOR('RCCOOR', latitud, longitud); 

        numEstado = parseInt(xmlDoc.getElementsByTagName("cucoor")[0].childNodes[0].nodeValue);
        let mal = parseInt(xmlDoc.getElementsByTagName("cuerr")[0].childNodes[0].nodeValue);

        if (numEstado == 1) {                                                                                   // todo a ido bien y se ha encontrado una parcela/inmueble
            strReferenciaCatastral =    xmlDoc.getElementsByTagName("pc1")[0].childNodes[0].nodeValue +     
                                        xmlDoc.getElementsByTagName("pc2")[0].childNodes[0].nodeValue;
        } else if (mal > 0) {                                                                                   // hay un error ... hay que auditar el xml
            numEstado = -1

        } else {                                                                                                // un error inesperado ... hay que auditar el xml
            console.log('Se ha producido un error; getRCCOOR()')
            numEstado = -1
            // TODO
            /* tendria que volcarse al log.ERR */
        }

        iReturnReferenciaCatastral = {
            numero:                 numEstado,
            referenciaCatastral:    strReferenciaCatastral,
            xml:                    xmlDoc 
        }

        return iReturnReferenciaCatastral;
    }


    /*
        Según el |recurso| seleccionado se devolvera un |xmlDocument|, ver los detalles en las funciones correspondientes.
        @param  {string} recurso, cual de los dos recursos vamos a querer la información; (['RCCOOR']|'RCCOOR_Distancia')
        @param  {number} longitud, responde a la coordenada de longitud
        @param  {number} latitud, responde a la coordenada de la latitud
      
        @return {xmlDocument} xmlDoc, es la respuesta del servidor del catastro
    */
    async _getCatastroRCCOOR(recurso: string, latitud: number, longitud: number): Promise<any> {

        let url: string;

        switch (recurso) {
            case 'RCCOOR_Distancia':
                url = 'http://ovc.catastro.meh.es/ovcservweb/OVCSWLocalizacionRC/OVCCoordenadas.asmx/Consulta_RCCOOR_Distancia';
                break;

            case 'RCCOOR':
            default:
                url = 'http://ovc.catastro.meh.es/ovcservweb/OVCSWLocalizacionRC/OVCCoordenadas.asmx/Consulta_RCCOOR';
        }

        let httpHeaders = new HttpHeaders()
            .set('Content-Type', 'text/xml; charset=utf-8')
            .set('Accept', 'text/xml')
            .set('Access-Control-Allow-Methods', 'GET');

        let httpParams = new HttpParams()
            .set('SRS', 'EPSG:4258')
            .set('Coordenada_X', longitud)
            .set('Coordenada_Y', latitud);
                                                                // https://angular.io/api/common/http/HttpClient#get y aqui una sobrecarga se define 
                                                                // con "responseType: 'text'" que devuelve un Observable<string> ... lo encontraras
        const p = new Promise<string>((resolve, reject) => {
            const o = this.httpClient.get(url, { headers: httpHeaders, params: httpParams, responseType: 'text' });
            o.subscribe(
                (r) => {                                    // parece ir todo bien 
                    resolve(r);
                },
                (e) => {                                    // se ha producido un ERROR
                    console.log(`ERROR:         ${e}`);                     // TODO
                    console.log(`procedimiento: _getCatastroRCCOOR`);       // enviarlo a un log de auditoria
                    console.log(`recurso:       ${recurso}`);
                    console.log(`latitud:       ${latitud}`);
                    console.log(`longitud:      ${longitud}`);
                },
                () => {                                     // ?
                    //console.log('Request completed')
                })
        });

        let str = await (p.then((r) => r));                                     // obtenemos una cadena, str
        let strXMLDeclaration = '<?xml version="1.0" encoding="utf-8"?>';       // debemos eliminar la 'XML Declaration' de la cadena... la suprimimos
        str = (str.replace(strXMLDeclaration, ''));                             // y sigue siendo una cadena xml, pero una cadena
        //console.log(str)                                                      
                                                                                // https://developer.mozilla.org/es/docs/Web/API/DOMParser
        var xmlDoc = new DOMParser().parseFromString(str, "application/xml");   // desde la cadena, string, lo convierte a XMLDocument ... 
        //console.log(xmlDoc)                                                   

        return xmlDoc;
    }


    /*
        Proporciona un IReturnModeloCatastro con la información que devuelve "Consulta_DNPRC"; Servicio de consulta de datos no protegidos para un 
        inmueble por su referencia catastral.
        + La url es https://ovc.catastro.meh.es/ovcservweb/OVCSWLocalizacionRC/OVCCallejero.asmx?op=Consulta_DNPRC"
        + Y la estructura que devuelve sera si el inmueble existe;
            ----- aqui hay otro tipo de estructura de datos cuando fracasa pero no se detalla pq solo se llama sobre seguro.
            ----- Si todo va bien 
            <consulta_dnp>
                <control>
                    <cudnp>NÚMERO DE INMUEBLES DE LOS QUE SE PROPORCIONAN DATOS</cudnp>
                    <cucons>NÚMERO DE UNIDADES CONSTRUCTIVAS (INCLUYENDO ELEMENTOS COMUNES)</cucons>
                    <cucul>NUMERO DE SUBPARCELAS (CULTIVOS)</cucul>
                </control>
                <bico>
                    <bi>
                        <idbi>
                            <cn>TIPO DE BIEN INMUEBLE</cn>
                            <rc>
                                <pc1>POSICIONES 1-7 DE LA REFERENCIA CATASTRAL (RC) DEL INMUEBLE</pc1>
                                <pc2>POSICIONES 8-14 DE LA RC DEL INMUEBLE</pc1>
                                <car>POSICIONES 15-19 DE LA RC (CARGO)</car>
                                <cc1>PRIMER DÍGITO DE CONTROL DE LA RC</cc1>
                                <cc2>SEGUNDO DÍGITO DE CONTROL DE LA RC </cc2>
                            </rc>
                        </idbi>
                        <ldt>DOMICILIO TRIBUTARIO NO ESTRUCTURADO (TEXTO)</ldt>
                        <debi> DATOS ECONÓMICOS DEL INMUEBLE
                            <luso>Residencial</luso>
                            <sfc>SUPERFICIE</sfc>
                            <cpt>COEFICIENTE DE PARTICIPACIÓN</cpt>
                            <ant>ANTIGUEDAD</ant>
                        </debi>
                    </bi>
                    <lcons>LISTA DE UNIDADES CONSTRUCTIVAS
                        <cons>UNIDAD CONSTRUCTIVA
                            <lcd>USO DE LA UNIDAD CONSTRUCTIVA</lcd>
                            <dt>
                                <lourb>
                                    <loint>
                                        <es>ESCALERA</es>
                                        <pt>PLANTA</pt>
                                        <pu>PUERTA</pu>
                                    </loint>
                                </lourb>
                            </dt>
                            <dfcons>
                                <stl>SUPERFICIE DE LA UNIDAD CONSTRUCTIVA</stl>
                            </dfcons>
                        </cons>
                        <cons>
                            <dfcons>
                                <stl>SUPERFICIE DE LOS ELEMENTOS COMUNES</stl>
                            </dfcons>
                        </cons>
                    </lcons>
                    <lspr>LISTA DE SUBPARCELAS
                        <spr>SUBPARCELA
                            <cspr>CÓDIGO DE SUBPARCELA</cspr>
                            <dspr>DATOS DE SUBPARCELA
                                <ccc>CALIFICACIÓN CATASTRAL</ccc>
                                <dcc>DENOMINACIÓN DE LA CLASE CULTIVO</dcc>
                                <ip>INTENSIDAD PRODUCTIVA</ip>
                                <ssp>SUPERFICIE DE LA SUBPARCELA EN METROS CUADRADOS</ssp>
                            </dspr>
                        </spr>
                    </lspr>
                </bico>
            </consulta_dnp>
        @goTo   _getCatastroDNPRC()
    */
    async getDNPRC(referenciaCatastral: string): Promise<any> {
        return await this._getCatastroDNPRC('DNPRC', referenciaCatastral);
    }

    
    /*
        Según el |recurso| seleccionado proporcionara ver los detalles en las funciones correspondientes.
        @param  {string} recurso, cual de los dos recursos vamos a querer la información; (['DNPRC']|)
        @param  {string} prmReferenciaCatastral, cadena que se forma con pc1 + pc2 
        @return IReturnModeloCatastro {
                    {number} numInmuebles, número de inmuebles de los que se proporcionan datos, cuando "cudnp" es [1, >1]
                    {(Inmueble|IParcela)} modeloCatastro es uno de los dos objetos según la situación cuando cudnp(=1, >1)
                    {XMLDocument] xmlDoc que ha recibido, lo devuelve para su auditoria.
                }
   */
   async _getCatastroDNPRC(recurso: string, prmReferenciaCatastral: string): Promise<any> {

        let url: string;

        switch (recurso) {
            case 'getDNPRC':
            default:
                url = 'https://ovc.catastro.meh.es//ovcservweb/OVCSWLocalizacionRC/OVCCallejero.asmx/Consulta_DNPRC';
        }

        let httpHeaders = new HttpHeaders()
            .set('Content-Type', 'text/xml; charset=utf-8')
            .set('Accept', 'text/xml')
            .set('Access-Control-Allow-Methods', 'GET');

        let httpParams = new HttpParams()
            .set('RC', prmReferenciaCatastral)
            .set('Municipio', '')                               // Tanto Municipio y Provincia no pueden ir en blanco ... en teoria, pq si funciona.
            .set('Provincia', '');                              
                                                                // https://angular.io/api/common/http/HttpClient#get y aqui una sobrecarga se define 
                                                                // con "responseType: 'text'" que devuelve un Observable<string> ... lo encontraras
        const p = new Promise<string>((resolve, reject) => {
            const o = this.httpClient.get(url, { headers: httpHeaders, params: httpParams, responseType: 'text' });
            o.subscribe(
                (r) => {                                    // parece ir todo bien 
                    resolve(r);
                },
                (e) => {                                    // se ha producido un ERROR
                                                            // he encontrado que cuando no hay internete llega aqui ... 
                    console.log(`--- ERROR ${e}; El servidor del Catastro devuelve Error`);  
                    console.log(`--- en el recurso ${recurso}`);
                },
                () => {                                     // ?
                    //console.log('Request completed')
                })
        });

        let str = await (p.then((r) => r));                                     // obtenemos una cadena, str
        let strXMLDeclaration = '<?xml version="1.0" encoding="utf-8"?>';       // debemos eliminar la 'XML Declaration' de la cadena... la suprimimos
        str = (str.replace(strXMLDeclaration, ''));                             // y sigue siendo una cadena xml, pero una cadena
        //console.log(str)                                                      
                                                                                // https://developer.mozilla.org/es/docs/Web/API/DOMParser
        var xmlDoc = new DOMParser().parseFromString(str, "application/xml");   // desde la cadena, string, lo convierte a XMLDocument ... 
        //console.log(xmlDoc)                                                   
        
        return this.__convertToReturn(xmlDoc);
    }


    /*
        Recibe un XMLDocument procedente de la respuesta a un petición 'Por Referencia Catastral' y la transforma en un objeto IReturnModeloCatastro.
        Hoy conocemos 3 tipos de diferentes de respuestas; las que responden a una Parcela, IParcela, las que responden a un Inmueble, IInmueble, y 
        las que responden a un Error, IParcela con los datos en blanco.
        En cualquier caso, despues de manipularlo devolvera la información apropiadamente en un objeto; IReturnModeloCatastro. 
        @param  {XMLDocument} xmlDoc es el XML del que partimos para extraer la información
        
        @return IReturnModeloCatastro { 
                    {number} numInmuebles, número de inmuebles de los que se proporcionan datos, cuando "cudnp" es [1, >1]
                    {(Inmueble|IParcela)} modeloCatastro es uno de los dos objetos según la situación cuando cudnp(=1, >1)
                    {XMLDocument] xmlDoc que ha recibido, lo devuelve para su auditoria. 
                }    
    */
    async __convertToReturn(xmlDoc: XMLDocument) {
        
        let iInmueble: IInmueble;
        let iInmuebleConstruccion: IInmuebleConstruccion;
        let iInmueblesConstruccion: IInmuebleConstruccion[];
                                                                
        let iParcelaInmuebles: IParcelaInmuebles[];

        let iReturnModeloCatastro: IReturnModeloCatastro;

        let numInmuebles = xmlDoc.getElementsByTagName("lerr").length==0 ? parseInt(xmlDoc.getElementsByTagName("cudnp")[0].childNodes[0].nodeValue): 0;

        let modeloCatastro;

        /* */
        switch (numInmuebles) {     
        case 0:                                                     //--- Parcela VACIA
            //console.log('... error Parcela !');
            //console.log(xmlDoc)

            iParcelaInmuebles = [];
            
            let parcelaInmuebles = {
                rcInmueble:         '',
                localizacionUrbana: ''
            }
            iParcelaInmuebles.push(parcelaInmuebles);

            let iParcela0: IParcela = {
                rcParcela:              '···',
                domicilioTributario:    '···',
                poblacion:              '···',
                provincia:              '···',
                parcelaInmuebles:        iParcelaInmuebles
            }
            modeloCatastro = iParcela0;
            break;

        case 1:                                                     //--- IInmueble
            //console.log('... sera un Inmueble !');
            //console.log(xmlDoc)

            iInmueblesConstruccion = [];

            let cons = xmlDoc.getElementsByTagName("cons");
            for (var i = 0; i < cons.length; i++) {
                let usoPrincipal =  cons[i].getElementsByTagName("lcd")[0].childNodes[0].nodeValue;
                let superficie =    cons[i].getElementsByTagName("stl")[0].childNodes[0].nodeValue;
                let loint =         cons[i].getElementsByTagName("loint");
                let escalera = '';
                let planta = '';
                let puerta = '';

                if (loint.length == 1) {
                    escalera =  (typeof (loint[0].getElementsByTagName("es")[0])) ? '' : loint[0].getElementsByTagName("es")[0].childNodes[0].nodeValue;
                    planta =    (typeof (loint[0].getElementsByTagName("pt")[0])) ? '' : loint[0].getElementsByTagName("pt")[0].childNodes[0].nodeValue;
                    puerta =    (typeof (loint[0].getElementsByTagName("pu")[0])) ? '' : loint[0].getElementsByTagName("pu")[0].childNodes[0].nodeValue;
                }

                let iInmuebleConstruccion = {
                    usoPrincipal:   usoPrincipal,
                    escalera:       escalera,
                    planta:         planta,
                    puerta:         puerta,
                    superficie:     superficie
                }
                iInmueblesConstruccion.push(iInmuebleConstruccion)
            }

            let iInmueble = {
                rcParcela:              xmlDoc.getElementsByTagName("pc1")[0].childNodes[0].nodeValue +
                                        xmlDoc.getElementsByTagName("pc2")[0].childNodes[0].nodeValue,
                rcInmueble:             xmlDoc.getElementsByTagName("pc1")[0].childNodes[0].nodeValue +
                                        xmlDoc.getElementsByTagName("pc2")[0].childNodes[0].nodeValue +
                                        xmlDoc.getElementsByTagName("car")[0].childNodes[0].nodeValue +
                                        xmlDoc.getElementsByTagName("cc1")[0].childNodes[0].nodeValue +
                                        xmlDoc.getElementsByTagName("cc2")[0].childNodes[0].nodeValue,
                localizacion:           xmlDoc.getElementsByTagName("ldt")[0].childNodes[0].nodeValue,
                clase:                  xmlDoc.getElementsByTagName("cn")[0].childNodes[0].nodeValue,
                usoPrincipal:           xmlDoc.getElementsByTagName("luso")[0].childNodes[0].nodeValue,
                superficieConstruida:   parseInt(xmlDoc.getElementsByTagName("sfc")[0].childNodes[0].nodeValue),
                anoConstruccion:        parseInt(xmlDoc.getElementsByTagName("ant")[0].childNodes[0].nodeValue),
                inmuebleParcela: {
                    localizacion:               xmlDoc.getElementsByTagName("ldt")[0].childNodes[0].nodeValue,
                    coeficienteParticipacion:   xmlDoc.getElementsByTagName("cpt").length == 0 ? 
                                                    '@ND' : 
                                                    xmlDoc.getElementsByTagName("cpt")[0].childNodes[0].nodeValue,
                },
                inmuebleConstruccion: iInmueblesConstruccion
            }
            modeloCatastro = iInmueble;
            break;

        default:                                                    //--- IParcela 
            //console.log('... sera un Parcela !');
            //console.log(xmlDoc);

            iParcelaInmuebles = [];

            let rcdnp = xmlDoc.getElementsByTagName("rcdnp");
            for (var i = 0; i < rcdnp.length; i++) {

                let rcdnp = xmlDoc.getElementsByTagName("rcdnp");
                let rcInmueble =            rcdnp[i].getElementsByTagName("pc1")[0].childNodes[0].nodeValue +
                                            rcdnp[i].getElementsByTagName("pc2")[0].childNodes[0].nodeValue +
                                            rcdnp[i].getElementsByTagName("car")[0].childNodes[0].nodeValue +
                                            rcdnp[i].getElementsByTagName("cc1")[0].childNodes[0].nodeValue +
                                            rcdnp[i].getElementsByTagName("cc2")[0].childNodes[0].nodeValue
                let localizacionUrbana =    rcdnp[i].getElementsByTagName("tv")[0].childNodes[0].nodeValue + ' ' +
                                            rcdnp[i].getElementsByTagName("nv")[0].childNodes[0].nodeValue + ' ' +
                                            rcdnp[i].getElementsByTagName("pnp")[0].childNodes[0].nodeValue + ' ' +
                                            'escalera: ' +
                                            rcdnp[i].getElementsByTagName("es")[0].childNodes[0].nodeValue + ' ' +
                                            'piso: ' +
                                            rcdnp[i].getElementsByTagName("pt")[0].childNodes[0].nodeValue + ' ' +
                                            'puerta: ' +
                                            rcdnp[i].getElementsByTagName("pu")[0].childNodes[0].nodeValue

                let parcelaInmuebles = {
                    rcInmueble:         rcInmueble,
                    localizacionUrbana: localizacionUrbana
                }
                iParcelaInmuebles.push(parcelaInmuebles)
            }

            let iParcela2: IParcela = {
                rcParcela:              xmlDoc.getElementsByTagName("pc1")[0].childNodes[0].nodeValue +
                                        xmlDoc.getElementsByTagName("pc2")[0].childNodes[0].nodeValue,
                domicilioTributario:    xmlDoc.getElementsByTagName("tv")[0].childNodes[0].nodeValue + ' ' +
                                        xmlDoc.getElementsByTagName("nv")[0].childNodes[0].nodeValue + ' ' +
                                        xmlDoc.getElementsByTagName("pnp")[0].childNodes[0].nodeValue,
                poblacion:              xmlDoc.getElementsByTagName("nm")[0].childNodes[0].nodeValue,
                provincia:              xmlDoc.getElementsByTagName("np")[0].childNodes[0].nodeValue,

                parcelaInmuebles:        iParcelaInmuebles
            }
            modeloCatastro = iParcela2;
            break;
        }

        /* */
        iReturnModeloCatastro = {
            numero:             numInmuebles,
            modeloCatastro:     modeloCatastro,
            xml:                xmlDoc
        }
        
        return iReturnModeloCatastro;
    }


    /*
        Genera un historico para tests que se salvaran en localStorage ... con la estructura IMarkilo
        Hay 10 elementos; 2 Parcelas, 7 Inmuebles y 1 Error. Las Parcelas tienen 2 y 4 Inmuebles; 7 + 6 = 13 Inmuebles.
    */
    async test__CrearHistorico_en_localStorage() {

        let preMarkilos = [
            {                                                               // es Parcela
                instante: '2016/07/16 12:52:09',
                latitud: 40.92465644496646,
                longitud: 0.8414186666402872,
                marcador: false,
                desc: 'Casa Cruz Gamada (Tarragona)',
                foto: 'casa_cruz_gamada__tarragona.jpg'
            },
            {                                                               // es Inmueble
                instante: '2017/07/16 00:53:09',
                latitud: 40.41634264194055,
                longitud: -3.6966086663337605,
                marcador: false,
                desc: 'Congreso de los Diputados (Madrid)',
                foto: 'congreso_de_los_diputados__madrid.jpg'
            },
            {                                                               // es Inmueble
                instante: '2019/11/02 11:53:09',
                latitud: 39.47439226625097,
                longitud: -0.37831976528385386,
                marcador: false,
                desc: 'La Lonja de la Seda (Valencia)',
                foto: 'la_lonja_de_la_seda__valencia.jpg'
            },
            {                                                               // es Inmueble
                instante: '2020/11/02 11:03:09',
                latitud: 42.880626849444305,
                longitud: -8.544646314889821,
                marcador: true,
                desc: 'Catedral de Santiago de Compostela (La Coruña)',
                foto: 'catedral_de_santiago_de_compostela__la_coruña.jpg'
            },
            {                                                               // es Inmueble
                instante: '2018/11/02 10:53:09',
                latitud: 41.40356145365357,
                longitud: 2.1744767782584358,
                marcador: true,
                desc: 'Sagrada Familia (Barcelona)',
                foto: 'sagrada_familia__barcelona.jpg'
            },
            {                                                               // es Inmueble
                instante: '2021/05/03 09:53:09',
                latitud: 37.878843641773095,
                longitud: -4.779620226997026,
                marcador: true,
                desc: 'La Mezquita (Cordoba)',
                foto: 'la_mezquita__cordoba.jpg'
            },
            {                                                               // es Inmueble
                instante: '2021/01/03 09:59:03',
                latitud: 37.17609897963017,
                longitud: -3.588145285711672,
                marcador: true,
                desc: 'La Alhambra (Granada)',
                foto: 'la_alhambra__granada.jpg'
            },
            {                                                               // es Parcela
                instante: '2021/05/03 11:03:03',
                latitud: 37.386348853983016,
                longitud: -5.992602966276505,
                marcador: true,
                desc: 'La Giralda (Sevilla)',
                foto: 'la_giralda__sevilla.jpg'
            },
            {                                                               // ... No hay Referencia Catastral 
                instante: '2020/05/03 11:13:09',
                latitud: 40.927409337781576,
                longitud: 0.8392742549965533,
                marcador: false,
                desc: '---Es un punto en las Vias de Tren---',
                foto: ''
            },
            {                                                               // es Inmueble
                instante: '2020/07/16 12:01:09',
                latitud: 40.928752005582545,
                longitud: 0.8503738259575321,
                marcador: false,
                desc: 'Port Esportiu Calafat',
                foto: 'port_esportiu_calafat__tarragona.jpg'
            }
        ];

        if (!localStorage.getItem(preMarkilos[0].instante)) {

            let rc;

            for (var i = 0; i < preMarkilos.length; i++) {
                                                                            // obtienes una Referencia Catastral, IReturnReferenciaCatastral, (parcela|inmueble)
                let rrc = await this.getRCCOOR(preMarkilos[i]['latitud'], preMarkilos[i]['longitud']);
                if (rrc.numero == -1) {                                     // se ha produciod un error en la peticion de coordenadas
                    // TODO
                    // mandar al historico
                    continue
                }

                /* Inmueble o Parcela */                                    // obtienes un modelo catastral, IReturnModeloCatastro
                let irmc = await this.getDNPRC(rrc.referenciaCatastral);
                if (irmc.numero == 0) {
                    // TODO
                    // mandar al historico
                    continue
                }

                let direccion: string = '';                                                     // IParcela
                if ( this.esParcela(irmc.modeloCatastro) === true ) {
                    direccion           =   irmc.modeloCatastro.domicilioTributario + ' ' +
                                            irmc.modeloCatastro.poblacion + ' (' +
                                            irmc.modeloCatastro.provincia + ')';
                } else {                                                                        // IInmueble
                    direccion           =   irmc.modeloCatastro.localizacion;
                }

                let markilo: IMarkilo = {
                    id:                 preMarkilos[i].instante,     //new Date().toLocaleString()
                    latitud:            preMarkilos[i].latitud,
                    longitud:           preMarkilos[i].longitud,
                    irmc:               irmc,
                    nota:               preMarkilos[i].desc,
                    direccion:          direccion,
                    favorito:           preMarkilos[i].marcador,
                    foto:               null,
                    fotografia:         null,
                }
                this.markiloAdd(markilo);
            }
            await this.markilosSave();
            //this.markilosLoad();
        }
    }
    

    /*
        Sobre los datos de test, localStorage;
        Presenta unicamente los ModelosCatastro que responden a IParcela ... solo los que son IParcela, nada más. 
    */
    async test__Listar_Solo_los_que_son_Parcelas()  {

        let parcelas = [];

        for (var i = 0; i < localStorage.length; i++) {
            let k = localStorage.key(i);
            let mkl: IMarkilo = JSON.parse(localStorage.getItem(k));
            if (this.esParcela(mkl.irmc.modeloCatastro) == true) {
                parcelas.push(mkl.irmc.modeloCatastro);
            }
        }
        console.log(`//--- Lista de Todos las Parcelas = ${parcelas.length}, y son estas;`)
        for (var i = 0; i < parcelas.length; i++) {
            console.log(`${i} - ${parcelas[i].rcParcela} - Inmuebles: ${(parcelas[i].parcelaInmuebles).length}`)
            console.log(`     - ${parcelas[i].domicilioTributario}`)
        }
    }


    /*
        Sobre los datos de test, localStorage;
        Presenta unicamente los ModelosCatastro que responden a IInmuebles y a los que responden a IParcela, se les
        extrae los IInumuebles y se muestran.
    */
    async test__Listar_Solo_los_que_son_Inmuebles() {

        let inmuebles = [];
    
        for (var i = 0; i < localStorage.length; i++) {
            let k = localStorage.key(i);
            let mkl: IMarkilo = JSON.parse(localStorage.getItem(k));
                        
            if (this.esParcela(mkl.irmc.modeloCatastro) == true) {
                let arr = await this.getInmuebles(mkl.irmc.modeloCatastro);
                for (var x= 0; x < arr.length; x++ ) {
                    inmuebles.push(arr[x])  
                }
            } else {
                inmuebles.push(mkl.irmc.modeloCatastro);
            }   
        }
        console.log('//--- Lista de Todos los Inmuebles')
        for (var j = 0; j < inmuebles.length; j++) {
            console.log(`${j} - ${inmuebles[j].rcInmueble} - ${inmuebles[j].localizacion}`)
            console.log(`       ${inmuebles[j].localizacion}`)
        }
    }
}