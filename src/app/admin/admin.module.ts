import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
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

export function tokenGetter() {
  return sessionStorage.getItem("token");
}

@NgModule({
  declarations: [
    AdminComponent,
    AddProductComponent,
    DashboardComponent,
    ProductCategoryComponent,
    NewCategoryComponent,
    NewSubcategoryComponent,
    NewProductComponent
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
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: ["192.168.37.49:3005"],
      },
    }),
    MatDialogModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatTabsModule,
    MatSelectModule,
    MatSelectSearchModule,
    NgxSpinnerModule
  ],
  providers: [
    AdminLogin,
    // {
    //   provide: HTTP_INTERCEPTORS,
    //   useClass: UnAuthorizedInterceptor,
    //   multi: true
    // },
    { provide: HTTP_INTERCEPTORS, useClass: SpinnerInterceptor, multi: true }
  ],
})
export class AdminModule {

}
