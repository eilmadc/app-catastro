//
//
import { Component, ViewChild, ElementRef, OnInit, AfterViewInit } from '@angular/core';
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);

import { CatastroService } from '../../shared/services/catastro/catastro.service';
import { IPeticionesPorAno } from '../../shared/interfaces/estadisticas.modelo';
import { IMarkilo } from '../../shared/interfaces/catastro.modelos';
import { MenuController } from '@ionic/angular';

//
//
@Component({
                selector:       'app-estadisticas',
                templateUrl:    './estadisticas.page.html',
                styleUrls:      ['./estadisticas.page.scss'],
            })

//
//
export class EstadisticasPage implements OnInit, AfterViewInit {

    //
    @ViewChild("barCanvas") barCanvas!: ElementRef;
    @ViewChild("doughnutCanvas") doughnutCanvas: ElementRef;
    @ViewChild("lineCanvas") lineCanvas: ElementRef;
    
    private barChart: Chart;
    private doughnutChart: Chart;
    private lineChart: Chart;
    
    public markilos: IMarkilo[] = [];
    public iPeticionesPorAno: IPeticionesPorAno[];

    //
    constructor(    
        private catastroServicio: CatastroService,
        private menuCtrl: MenuController
        ) { }

    //Control Toggle Menu con MenuController
    ionViewWillEnter() {
        this.menuCtrl.enable(true);
        this.menuCtrl.swipeGesture(true);
      }

    //
    async ngOnInit() {
        await this.catastroServicio.markilosLoad();
        //this.markilos = await this.catastroServicio.markilosGet();
        //this.petitcionesCatastroPorAno();
    }

    //
    async ngAfterViewInit() { 
        await this.petitcionesCatastroPorAno();
        this.barChartMetodo(this.iPeticionesPorAno, '# Peticiones');
    }


    /*
        Recopila los datos de los petociones registrados y hace un resumen de 'Peticiones por Año' y devuelve una matriz de IPeticionesPorAno.

        @return {IPeticionesPorAno[]}
    */
    async petitcionesCatastroPorAno(): Promise<IPeticionesPorAno[]> {

        await this.catastroServicio.markilosLoad(); 
        let markilos = await this.catastroServicio.markilosGet();
        let iPeticionesPorAno: IPeticionesPorAno[] = [];

        for (var i = 0; i < markilos.length; i++) {

            const fecha = new Date(markilos[i].id);
            let jaro = fecha.getFullYear()
            
            let x = iPeticionesPorAno.findIndex(o => o.ano === jaro);
            if  ( x > -1 ) {
                //console.log(`${i} esta en if > -1 `)
                iPeticionesPorAno[x].peticiones = iPeticionesPorAno[x].peticiones + 1;
            } else {
                //console.log(`${i} esta en else > -1 `)
                var ippa = {ano: jaro, peticiones: 1};
                iPeticionesPorAno.push(ippa);
            }
        }
        
        //console.log(this.iPeticionesPorAno)
        
        //this.iPeticionesPorAno.sort((o1, o2) => o1.ano - o2.ano);
        //console.log(`----- 1`)
        //console.log(this.iPeticionesPorAno)
        
        return iPeticionesPorAno
    }


    /*
        Construye una 'Gráfica de Barras' con los valores pasados ... son solo 6 barras.

        @param  {IPeticionesPorAno} iPeticionesPorAno, con los años y las peticiones hechas.
        @param  {string} strEtiqueta que podría ser perfectamente la leyenda de las unidades.
    */
    async barChartMetodo(iPeticionesPorAno, strEtiqueta: string) {

        //await this.petitcionesCatastroPorAno();
        //console.log(2);
        //console.log(this.iPeticionesPorAno);

        // console.log(ipcpa);

        //let arrEtiquetas: string[];
        //let arrDatos: number[];

        /*
        const mapper = new Map(iPeticionesPorAno);

        let arrEtiquetas: string[];
        let arrDatos: number[];

        iPeticionesPorAno.forEach(function (kv) {
            console.log(kv);
            arrEtiquetas.push(kv.ano.toString());
            console.log(kv.ano.toString());
            arrDatos.push(kv.peticiones);
            console.log(kv.peticiones)
        });
        //console.log(arrEtiquetas)
        //console.log(arrDatos)
        */


        let arrDatos=       [1, 1, 1, 2, 2, 4];
        let arrEtiquetas =  ["2016", "2017", "2018", "2019", "2020", "2021"];

        this.barChart = new Chart(this.barCanvas.nativeElement, {
            type:       "bar",
            data:       {   
                
                labels:     arrEtiquetas,
                            datasets:   [   {
                                                label: strEtiqueta,
                                                data:   arrDatos,
                                                backgroundColor: [
                                                        "rgba(255, 99, 132, 0.2)",
                                                        "rgba(54, 162, 235, 0.2)",
                                                        "rgba(255, 206, 86, 0.2)",
                                                        "rgba(75, 192, 192, 0.2)",
                                                        "rgba(153, 102, 255, 0.2)",
                                                        "rgba(255, 159, 64, 0.2)"
                                                ],
                                                borderColor: [
                                                        "rgba(255,99,132,1)",
                                                        "rgba(54, 162, 235, 1)",
                                                        "rgba(255, 206, 86, 1)",
                                                        "rgba(75, 192, 192, 1)",
                                                        "rgba(153, 102, 255, 1)",
                                                        "rgba(255, 159, 64, 1)"
                                                ],
                                                borderWidth: 1
                                            }]
                        },
            options:    { scales: { y: { beginAtZero: true } } } 
        });
        
    }


    /*
        this.doughnutChart = new Chart(this.doughnutCanvas.nativeElement, {
            type:   "doughnut",

            data:      {
                            labels:     ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],

                            datasets:   [   {
                                                label:              "# of Votes",
                                                data:               [12, 19, 3, 5, 2, 3],
                                                backgroundColor:    [
                                                                        "rgba(255, 99, 132, 0.2)",
                                                                        "rgba(54, 162, 235, 0.2)",
                                                                        "rgba(255, 206, 86, 0.2)",
                                                                        "rgba(75, 192, 192, 0.2)",
                                                                        "rgba(153, 102, 255, 0.2)",
                                                                        "rgba(255, 159, 64, 0.2)"
                                                                    ],
                                                hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#FF6384", "#36A2EB", "#FFCE56"]
                                            }   
                                        ]
                        }
        });

        this.lineChart = new Chart(this.lineCanvas.nativeElement, {
            type:   "line",

            data:   {
                            labels:     ["January", "February", "March", "April", "May", "June", "July"],
                            datasets:   [
                                            {
                                                label:                      "My First dataset",
                                                fill:                       false,
                                                lineTension:                0.1,
                                                backgroundColor:            "rgba(75,192,192,0.4)",
                                                borderColor:                "rgba(75,192,192,1)",
                                                borderCapStyle:             "butt",
                                                borderDash:                 [],
                                                borderDashOffset:           0.0,
                                                borderJoinStyle:            "miter",
                                                pointBorderColor:           "rgba(75,192,192,1)",
                                                pointBackgroundColor:       "#fff",
                                                pointBorderWidth:           1,
                                                pointHoverRadius:           5,
                                                pointHoverBackgroundColor:  "rgba(75,192,192,1)",
                                                pointHoverBorderColor:      "rgba(220,220,220,1)",
                                                pointHoverBorderWidth:      2,
                                                pointRadius:                1,
                                                pointHitRadius:             10,
                                                data:                       [65, 59, 80, 81, 56, 55, 40],
                                                spanGaps:                   false
                                            }
                                        ]
                    }
        });
    */

    /*

    */

}
