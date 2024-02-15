import { Component, Input, ViewChild } from '@angular/core';
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexTitleSubtitle,
  ApexDataLabels,
  ApexLegend,
  ApexFill,
  ApexAnnotations,
  ApexGrid,
  ApexNonAxisChartSeries,
  ApexPlotOptions,
  ApexResponsive,
  ApexStates,
  ApexTheme,
  ApexTooltip,
  ApexStroke,
  ApexYAxis,
  ApexMarkers,
} from "ng-apexcharts";
import { ElementRef } from '@angular/core';
import { ApexOptions } from 'ng-apexcharts';
import { ChartType } from 'ngx-apexcharts';

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
};

export type ChartOptions2 = {
  series2: ApexAxisChartSeries;
  chart2: ApexChart;
  dataLabels2: ApexDataLabels;
  stroke2: ApexStroke;
  xaxis2: ApexXAxis;
  yaxis2: ApexYAxis;
  title2: ApexTitleSubtitle;
  markers2: ApexMarkers;
};

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {

   @ViewChild("chart") chart!: ChartComponent;
   public chartOptions!: Partial<ChartOptions>
   public chartOptions2!: Partial<ChartOptions2>

   constructor() {
     this.chartOptions = {
       series: [44, 55, 13, 43, 22],
       chart: {
         width: 380,
         type: "donut"
       },
       labels: ["Team A", "Team B", "Team C", "Team D", "Team E"],
       responsive: [
         {
           breakpoint: 480,
           options: {
             chart: {
               width: 200
             },
             legend: {
               position: "bottom"
             }
           }
         }
       ]
     };



     this.chartOptions2 = {
      series2: [
        {
          name: "New York Temperature",
          data: [
            {
              x: "Jan",
              y: [-2, 4]
            },
            {
              x: "Feb",
              y: [-1, 6]
            },
            {
              x: "Mar",
              y: [3, 10]
            },
            {
              x: "Apr",
              y: [8, 16]
            },
            {
              x: "May",
              y: [13, 22]
            },
            {
              x: "Jun",
              y: [18, 26]
            },
            {
              x: "Jul",
              y: [21, 29]
            },
            {
              x: "Aug",
              y: [21, 28]
            },
            {
              x: "Sep",
              y: [17, 24]
            },
            {
              x: "Oct",
              y: [11, 18]
            },
            {
              x: "Nov",
              y: [6, 12]
            },
            {
              x: "Dec",
              y: [1, 7]
            }
          ]
        }
      ],
      chart2: {
        height: 350,
        type: "rangeArea"
      },
      stroke2: {
        curve: "straight"
      },
      title2: {
        text: "New York Temperature (all year round)"
      },
      markers2: {
        hover: {
          sizeOffset: 5
        }
      },
      dataLabels2: {
        enabled: false
      },
      yaxis2: {
        labels: {
          formatter: (val) => {
            return val + "°C";
          }
        }
      }
    }; 

    
   }


 
}
