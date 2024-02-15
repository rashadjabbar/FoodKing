import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { AdminComponent } from './admin.component';
import { RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';
import { ProductCategoryComponent } from './product-category/product-category.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import {MatDialogModule} from '@angular/material/dialog';
import { NewCategoryComponent } from './product-category/new-category/new-category.component';
import { NewSubcategoryComponent } from './product-category/new-subcategory/new-subcategory.component';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import {MatTabsModule} from '@angular/material/tabs';
import {MatSelectModule} from '@angular/material/select';
import { MatSelectSearchModule } from 'mat-select-search';
import { UnAuthorizedInterceptor } from 'src/environments/un-authorized.interceptor';
import { AdminLogin } from 'src/guards/admin-login.guard';
import { JwtModule } from '@auth0/angular-jwt';
import { SpinnerInterceptor } from 'src/interceptor/spinner.interceptor';
import { NgxSpinnerModule } from 'ngx-spinner';
import { AddProductComponent } from './product/product.component';
import { NewProductComponent } from './product/new-product/new-product.component';
import {GlobalService} from '../../services/global.service'
import { PaymentComponent } from './payment/payment.component';
import { NewPaymentComponent } from './payment/new-payment/new-payment.component';
import { OrderComponent } from './order/order.component';
import { SaveOrderComponent } from './order/save-order/save-order.component';
import { EditOrderPopupComponent } from './order/edit-order-popup/edit-order-popup.component';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { DailyReportComponent } from './daily-report/daily-report.component';
import {MatTooltipModule} from '@angular/material/tooltip';
import { DailyProductNotesComponent } from './daily-report/daily-product-notes/daily-product-notes.component';
import { ReportComponent } from './report/report.component';
import { NgApexchartsModule } from 'ng-apexcharts';

@NgModule({
  declarations: [
    AdminComponent,
    AddProductComponent,
    DashboardComponent,
    ProductCategoryComponent,
    NewCategoryComponent,
    NewSubcategoryComponent,
    NewProductComponent,
    PaymentComponent,
    NewPaymentComponent,
    OrderComponent,
    SaveOrderComponent,
    EditOrderPopupComponent,
    DailyReportComponent,
    DailyProductNotesComponent,
    ReportComponent,
    

  ],
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatPaginatorModule,
    MatCheckboxModule,
    MatMenuModule,
    MatButtonModule,
    HttpClientModule,
    MatAutocompleteModule,
    MatDialogModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatTabsModule,
    MatSelectModule,
    MatSelectSearchModule,
    NgxSpinnerModule,
    MatTooltipModule,
    MatDatepickerModule,
    MatNativeDateModule ,
    NgApexchartsModule
  ],
  providers: [
    MatDatepickerModule,
    AdminLogin,
    // {
    //   provide: HTTP_INTERCEPTORS,
    //   useClass: UnAuthorizedInterceptor,
    //   multi: true
    // },
    { provide: HTTP_INTERCEPTORS, useClass: SpinnerInterceptor, multi: true, },
    DatePipe
  ],
})
export class AdminModule {

}
