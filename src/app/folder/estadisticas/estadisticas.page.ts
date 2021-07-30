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
        this.graficoBarras(this.iPeticionesPorAno, '# Peticiones');
        this.graficoDonut(this.iPeticionesPorAno, '# Peticiones');
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
        
        return iPeticionesPorAno
    }


    /*
        Construye una 'Gráfica de Barras' con los valores pasados ... son solo 6 barras.

        @param  {IPeticionesPorAno} iPeticionesPorAno, con los años y las peticiones hechas.
        @param  {string} strEtiqueta que podría ser perfectamente la leyenda de las unidades.
    */
    async graficoBarras(iPeticionesPorAno, strEtiqueta: string) {

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
        Construye una 'Gráfica Donut' con los valores pasados, y muestra la relación de las partes con el todo.

        @param  {IPeticionesPorAno} iPeticionesPorAno, con los años y las peticiones hechas.
        @param  {string} strEtiqueta que podría ser perfectamente la leyenda de las unidades.
    */
    async graficoDonut(iPeticionesPorAno, strEtiqueta: string) {

        let arrEtiquetas = ["2016", "2017", "2018", "2019", "2020", "2021"];
        let arrDatos = [1, 1, 1, 2, 2, 4];

        this.doughnutChart = new Chart(this.doughnutCanvas.nativeElement, {
            type: "doughnut",
            data: {
                labels: arrEtiquetas,
                datasets: [{
                    label: strEtiqueta,
                    data: arrDatos,
                    backgroundColor: [
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
    }


    /*
        Construye un 'Gráfico Donut' con los valores pasados, y ayudan a ver la evolucion de los datos. Por lo general 
        se usan para mostrar un mismo tipo de dato y su evolucion

        @param  {IPeticionesPorAno} iPeticionesPorAno, con los años y las peticiones hechas.
        @param  {string} strEtiqueta que podría ser perfectamente la leyenda de las unidades.
    */
    async graficoLineas(iPeticionesPorAno, strEtiqueta: string) {

        let arrEtiquetas = ["2016", "2017", "2018", "2019", "2020", "2021"];
        let arrDatos = [1, 1, 1, 2, 2, 4];

        this.lineChart = new Chart(this.lineCanvas.nativeElement, {
            type: "line",
            data: {
                labels: arrEtiquetas,
                datasets: [{
                    label: "My First dataset",
                    fill: false,
                    tension: 0.1,
                    backgroundColor: "rgba(75,192,192,0.4)",
                    borderColor: "rgba(75,192,192,1)",
                    borderCapStyle: "butt",
                    borderDash: [],
                    borderDashOffset: 0.0,
                    borderJoinStyle: "miter",
                    pointBorderColor: "rgba(75,192,192,1)",
                    pointBackgroundColor: "#fff",
                    pointBorderWidth: 1,
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: "rgba(75,192,192,1)",
                    pointHoverBorderColor: "rgba(220,220,220,1)",
                    pointHoverBorderWidth: 2,
                    pointRadius: 1,
                    pointHitRadius: 10,
                    data: arrDatos,
                    spanGaps: false,
                }]
            }
        });
    }
}
