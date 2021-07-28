/*
    Los modelos que aqui se describen responden a 2 de las 3 posibles respuestas que proporciona; Consulta_DNPRC en el enlace
    https://ovc.catastro.meh.es/ovcservweb/OVCSWLocalizacionRC/OVCCallejero.asmx?op=Consulta_DNPRC
    Servicio de consulta de datos no protegidos para un inmueble por su referencia catastral, %AKA(RC).

    Puede saber si ha encontrado con exito la RC podemos examinar el field |cudnp|, si es =1 es la indicada pero si es >1 es una lista 
    que coinciden.
                                        // la parcela pouede tener 1 o >1 inmueble
    Parcela {   this.id             
                Inmueble1,
                Inmueble2,
                ...
                InmuebleN
                } 
                                        // el inmueble solo pertener a una Parcela
    Inmueble {  this.id             
                this.localizacon
                this.uso
                this.superficies
                ...
                }
*/

import { IFoto } from "./foto.modelo";

/*
    Modelo de Datos usado para contener la respuesta a las peticiones por Coordendas. 
*/
export interface IReturnReferenciaCatastral {
    numero: number,                     // =-1 se ha producido un error, =0 no hay nada en esa posicion, =1 con la referencia y >0 no se espera.
    referenciaCatastral: string,        // 
    xml: XMLDocument,              //
}

/*
    Estructura de datos para contener la respuesta a las peticiones por Referencia Catastral.
*/
export interface IReturnModeloCatastro {
    numero: number,                     // número de inmuebles; 0=error, =1 es Inmueble, >1 es Parcela
    modeloCatastro: any,                // (IParcela|IInmueble)
    xml: XMLDocument,            //
}

/*
    Estructura para almacenar 
*/
export interface IMarkilo {
    id:                     string,                             // debe responder, siempore, a new Date().toLocaleString() 
    latitud:                number,                             //
    longitud:               number,                             //
    irmc:                   IReturnModeloCatastro,              // 
    nota:                   string,                             // nota del usuario para identificar la petición
    direccion:              string,                             // IParcela.domicilioTributario && IInmueble.localizacion
    favorito:               boolean,
    foto?:                  IFoto,                              // puede albergar una foto ... o quizas la uri
    fotografia:             string,                             // 
}


/*º
    Inmueble.

   <control>
       +cudnp                                   número de inmuebles de los que se proporcionan datos
       +cucons                                  número de unidades constructivas (incluyendo elementos comunes)
       +cucul                                   numero de subparcelas (cultivos)

   <bico>
       +bi
           -idbi   /cn                          (ur|) - Tipo de Bien Inmueble
                   /rc/pc1                      posiciones 1-7 de la referencia catastral (rc) del inmueble
                      /pc2                      posiciones 8-14 de la referencia catastral (rc) del inmueble
                      /car                      posiciones 15-19 de la rc (cargo)
                      /cc1                      primer dígito de control de la rc
                      /cc2                      segundo dígito de control de la rc

           -dt     /loine/cp                    @nd
                         /cm                    @nd
                   /cmc
                   /np
                   /nm

           -ldt                                domicilio tributario no estructurado (texto)

           -debi                               -- los datos económicos del inmueble --
                   luso                        Uso Principal (Residencial|...)
                   sfc                         superficie
                   cpt                         coef de participación
                   ant                         antiguedad

       +lcons
           -cons[0]
                       ·lcd                    Uso de la Unidad Constructiva

                       ·dt/lourb/loint[y]/es   escalera
                                         /pt   planta
                                         /pu   puerta
                       ·dfcons/stl             Superficie de la Unidad Constructiva

           ·cons[1]
                       ·lcd                    Uso de la Unidad Constructiva
                       ·/dfcons/stl            Superficie de los Elementos Comunes
*/
export interface IInmueble {

    rcParcela:                  string,                 // /bico/bi/idbi/rc/pc1 +   
                                                        // /bico/bi/idbi/rc/pc2 
    rcInmueble:                 string,                 // /bico/bi/idbi/rc/pc1 +
                                                        // /bico/bi/idbi/rc/pc2 +
                                                        // /bico/bi/idbi/rc/car + 
                                                        // /bico/bi/idbi/rc/cc1 +   cc1 y cc2, en principio, son solo de control no afecta a la RC el resultado en 
                                                        // /bico/bi/idbi/rc/cc2     la consulta no parece cambiar el resultado. Es como la letra en el DNI.
    localizacion:               string,                 // /bico/bi/ltd                                 // domicilio tributario no estructurado (texto)
    clase:                      string,                 // /bico/bi/idbi/cn                             // Tipo de Bien Inmueble ... no lo tengo claro. (Urbano|Vivienda|...
    usoPrincipal:               string,                 // /bico/bi/debi/luso                           // (Residencial|Edif. Singular|...
    superficieConstruida:       number,                 // /bico/bi/debi/sfc                            // superficie en m2
    anoConstruccion:            number,                 // /bico/bi/debi/ant                            // año de construccion, aqui es la antiguedad
    inmuebleParcela:            IInmuebleParcela,       //
    inmuebleConstruccion:       IInmuebleConstruccion[],
}

interface IInmuebleParcela {
    //titulo:                   string,                 // desconozco el origen ... parece que lo deduce
    localizacion:               string,                 // /bico/bi/ltd
    //superficieGrafica:        string,                 //  
    coeficienteParticipacion:   string                  // /bico/bi/debi/cpt                            // coeficiente de participación
}

export interface IInmuebleConstruccion {
    usoPrincipal:               string,                 // /bico/lcons/cons[x]/lcd                       // Uso de la Unidad Constructiva
    escalera?:                  string,                 // /bico/lcons/cons[x]/dt/lourb/loint[y]/es      // escalera
    planta?:                    string,                 // /bico/lcons/cons[x]/dt/lourb/loint[y]/pt      // planta
    puerta?:                    string,                 // /bico/lcons/cons[x]/dt/lourb/loint[y]/pu      // puerta
    superficie:                 string,                 // /bico/lcons/cons[x]/dfcons/stl                // superficie, en m2
    //tipoReforma?:           string,                   // desconozco el origen de la info           
    //fechaReforma?:          string                    // desconozco el origen de la info
}

/*
    Parcela. 
    Este modelo es la %SIC(Una lista de todos los inmuebles que coinciden con los criterios de búsqueda). 

   <control>
       +cudnp                               número de items en la lista de bienes inmuebles

   <lrcdnp>
        *rcdnp[x]
            +rc
                /pc1                        posiciones 1-7 de la referencia catastral (rc) del inmueble
                /pc2                        posiciones 8-14 de la referencia catastral (rc) del inmueble
                /car                        posiciones 15-19 de la rc (cargo)
                /cc1                        primer dígito de control de la rc
                /cc2                        segundo dígito de control de la rc

            +dt                             domicilio tributario del inmueble
                -loine
                        /cp                 @desconocido
                        /cm                 @desconocido
                -cmc                        @desconocido
                -np                         =Provincia
                -nm                         =Localidad

            +lous
                -lourb
                    ·dir
                        /cv                 @desconocido    ~
                        /tv                 @desconocido    ~el tipo de (Calle|Pasaje|...), o lo que sea
                        /nv                 @desconocido    ~el nombre de la (Calle|Pasaje|...), o lo que sea
                        /pnp                @desconocido    ~el numero de la (Calle|Pasaje|...), o lo que sea
                    ·loint
                        /es                 escalera
                        /pt                 planta
                        /pu                 puerta
                    ·dp                     ~codigo postal 
                    ·dm                     @desconocido
*/
export interface IParcela {

    rcParcela: string,                          // /lrcdnp/rcdnp[0]/rc/pc1 +         // Es el id de la referencia catastral de la Parcela Catastral
                                                // /lrcdnp/rcdnp[0]/rc/pc2           // 
                                                //titulo: string,                               // desconozco el origen ... parece que lo deduce
    domicilioTributario: string,                // /lrcdnp/rcdnp[0]/lous/lourb/dir/tv +             // en principio nos vale con los del primer
                                                // /lrcdnp/rcdnp[0]/lous/lourb/dir/nv +             // elemento
                                                // /lrcdnp/rcdnp[0]/lous/lourb/dir/pnp
    poblacion: string,                          // /lrcdnp/rcdnp[0]/dt/nm
    provincia: string,                          // /lrcdnp/rcdnp[0]/dt/np
    parcelaInmuebles: IParcelaInmuebles[],
}

/* */
export interface IParcelaInmuebles {

    rcInmueble:                 string,         // /lrcdnp/rcdnp[x]/rc/pc1 +         // esta referencia la necesitamos bien formada para asegurarnos
                                                // /lrcdnp/rcdnp[x]/rc/pc2 +         // que devuelve solo y unicamente una RC
                                                // /lrcdnp/rcdnp[x]/rc/car +
                                                // /lrcdnp/rcdnp[x]/rc/cc1 +
                                                // /lrcdnp/rcdnp[x]/rc/cc2              
    localizacionUrbana:         string,         // /lrcdnp/rcdnp[x]/lous/lourb/dir/tv +         // tipo de calle
                                                // /lrcdnp/rcdnp[x]/lous/lourb/dir/nv +         // nombre de la calle
                                                // /lrcdnp/rcdnp[x]/lous/lourb/loint/es +       // escalera
                                                // /lrcdnp/rcdnp[x]/lous/lourb/loint/pt +       // planta   
                                                // /lrcdnp/rcdnp[x]/lous/lourb/loint/pu         // puerta 
    //usoPrincipal:               string,         //
    //superficieConstruida:       number,         // 
    //participacionInmueble:      number,         //
    //anoConstruccion:            number,         //
}