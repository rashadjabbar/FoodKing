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
import { DashboardService } from 'src/services/dashboard.service';
import { FormControl, FormGroup } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Subscription, timer } from "rxjs";
import { DateRange, MatDatepicker } from '@angular/material/datepicker';
import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
import { default as _rollupMoment, Moment } from 'moment';
const moment = _rollupMoment || _moment;


export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};
export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
  headerTotals: any;
};

export type ChartOptionsMounthly = {
  series: ApexAxisChartSeries;
  chartMonthly: ApexChart;
  xaxis: ApexXAxis;
  dataLabels: ApexDataLabels;
  grid: ApexGrid;
  fill: ApexFill;
  markers: ApexMarkers;
  yaxis: ApexYAxis;
  stroke: ApexStroke;
  title: ApexTitleSubtitle;
};



export type chartOptionsProduct = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  plotOptions: ApexPlotOptions;
  labels: any;
  colors: string[];
};

@Component({
  selector: 'app-client-dashboard',
  templateUrl: './client-dashboard.component.html',
  styleUrls: ['./client-dashboard.component.scss']
})

export class ClientDashboardComponent {
  date = new FormControl(moment());
  @ViewChild("chart") chart!: ChartComponent;
  @ViewChild("chartMonthly") chartMonthly!: ChartComponent;
  public chartOptions!: Partial<ChartOptions>
  public chartOptionsMonthly!: Partial<ChartOptionsMounthly>
  public chartOptionsProduct!: Partial<chartOptionsProduct>

  time = new Date();
  intervalId;
  subscription!: Subscription;

  dashboardData!: any;
  totalAmounts!: any[];
  monthlyAmounts: any[] = [];
  monthlyAmountDate: any[] = [];

  topProductNames: any[] = [];
  topProductCount: any[] = [];

  beginDate: any = new Date();
  
  endDate: any = new Date()

  range = new FormGroup({
    start: new FormControl<string>(this.datePipe.transform(this.beginDate.setDate(1), 'yyyy-MM-dd')!), //this.beginDate.setMonth(this.beginDate.getMonth() - 1
    end: new FormControl<string>(this.datePipe.transform(this.endDate, 'yyyy-MM-dd')!),
  });

  //array1: any [] = ['Bu aralar heç o deyilsən..']; 
  //array2: any [] = ['Normalni zəifçilik..']; 
  //array3: any [] = ['Qənaətbəxş']; 
  //array4: any [] = ['Vəhşii']; 
  array5: any [] = ['Krokodil', 'Alliqator']; 

  textObject = {
    "1":'Bu aralar heç o deyilsən..',
    "2":'Normalni zəifçilik..',
    "3":'Qənaətbəxş',
    "4":'Vəhşii',
    "5":this.getRandomArrayValue(this.array5)
  }

  constructor(
    private dashboardService: DashboardService,
    private datePipe: DatePipe,
  ) {


  }

  ngOnInit() {
    // Using Basic Interval
    this.intervalId = setInterval(() => {
      this.time = new Date();
    }, 1000);
    this.getDashboardInfo();

    this.updateMonthlyAmountChart(this.monthlyAmounts, this.monthlyAmountDate)
    this.updateTopProductChart(this.monthlyAmounts, this.monthlyAmountDate)

  }

  updateMonthlyAmountChart(monthlyAmounts: any[] , monthlyAmountDate: any[]) {
    this.chartOptionsMonthly = {
      series: [
        {
          name: "Məbləğ",
          data: monthlyAmounts
        }
      ],
      chartMonthly: {
        height: 453,
        type: "line"
      },
      stroke: {
        width: 7,
        curve: "smooth"
      },
      xaxis: {
        type: "category",
        categories: monthlyAmountDate
      },
      title: {
        text: "Aylıq istifadə",
        align: "left",
        style: {
          fontFamily: 'Verdana, Times, serif',
          fontWeight: 900,
          fontSize: "16px",
          color: "#666",
        }
      },
      fill: {
        type: "gradient",
        gradient: {
          shade: "dark",
          gradientToColors: ["#FDD835"],
          shadeIntensity: 1,
          type: "horizontal",
          opacityFrom: 1,
          opacityTo: 1,
          stops: [0, 100, 100, 100]
        }
      },
      markers: {
        size: 4,
        colors: ["#FFA41B"],
        strokeColors: "#fff",
        strokeWidth: 2,
        hover: {
          size: 7
        }
      },
      yaxis: {
        min: 0,
        max: 200,
        title: {
          text: "Məbləğ ₼",
          style: {
            fontFamily: 'Trebuchet MS, sans-serif',
            fontWeight: 400,
            fontSize: "16px",
            color: "#666"
          }
        }
      }
    };
  }

  updateTopProductChart(topProductNames: any[], topProductCount: any[]){
    this.chartOptionsProduct = {
      series: topProductCount,
      chart: {
        type: "donut"
      },
      labels: topProductNames,

      plotOptions: {
        pie: {
          customScale: 1,
          donut: {

            labels: {
              show: true,
              total: {
                show: false,
                label: '',
                formatter: () => 'Text you want'
              }
            }
          }
        }
      },
      colors: [
        '#FE995C',
        '#37647D',
        '#418B7C',
        '#80f04d',
        '#8956b0',
        '#de333e',
        '#6b8e23',
        '#cddb32'
      ],
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

  }
  
  getDashboardInfo() {
    this.range.controls.end.patchValue(this.datePipe.transform(this.range.controls.end.value, 'yyyy-MM-dd')!)
    this.range.controls.start.patchValue(this.datePipe.transform(this.range.controls.start.value, 'yyyy-MM-dd')!)

    this.dashboardService.getDashboardInfo(this.range.controls.start.value, this.range.controls.end.value).subscribe((res: any) => {
      this.dashboardData = res.data

      //console.log(res.data)

      ///////////Monthly Amount

      this.monthlyAmounts = []
      for (let index = 0; index < res.data.monthlyAmounts.length; index++) {
        const amount = res.data.monthlyAmounts[index].amount
        this.monthlyAmounts.push(amount)
      }

      this.monthlyAmountDate = [];
      for (let index = 0; index < res.data.monthlyAmounts.length; index++) {
        const date = res.data.monthlyAmounts[index].date
        this.monthlyAmountDate.push(date)
      }

      ////////////Top Products

      this.topProductNames = []
      for (let index = 0; index < res.data.topProducts.length; index++) {
        const name = res.data.topProducts[index].name
        this.topProductNames.push(name)
      }

      this.topProductCount = []
      for (let index = 0; index < res.data.topProducts.length; index++) {
        const count = res.data.topProducts[index].count
        this.topProductCount.push(count)
      }

      setTimeout(() => {
        this.updateMonthlyAmountChart(this.monthlyAmounts , this.monthlyAmountDate)
        this.updateTopProductChart(this.topProductNames, this.topProductCount)

      }, 1000);

    })
  }

  selectToday() {
    this.range.controls.end.patchValue(this.datePipe.transform(this.endDate, 'yyyy-MM-dd')!)
    this.range.controls.start.patchValue(this.datePipe.transform(this.endDate, 'yyyy-MM-dd')!)
  }

  mclick = 0;
  get controls() {
    return this.range.controls;
  }

  setMonthAndYear(normalizedMonthAndYear: Moment, datepicker: MatDatepicker<DateRange<moment.Moment>>) {
    const ctrlValue = this.date.value ?? moment();
    ctrlValue.month(normalizedMonthAndYear.month());
    ctrlValue.year(normalizedMonthAndYear.year());
    this.date.setValue(ctrlValue);
    datepicker.close();
  }

  search() {
    this.range.controls.end.patchValue(this.datePipe.transform(this.range.controls.end.value, 'yyyy-MM-dd')!)
    this.range.controls.start.patchValue(this.datePipe.transform(this.range.controls.start.value, 'yyyy-MM-dd')!)
    if (this.range.controls.end.value == null) {
      this.range.controls.end.patchValue(this.datePipe.transform(this.endDate, 'yyyy-MM-dd')!)
    }
    this.getDashboardInfo()
  }

  getRandomArrayValue(array: any[]): any {
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
  }

}
