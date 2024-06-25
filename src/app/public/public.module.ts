import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PublicComponent } from './public.component';
import { AppRoutingModule } from '../app-routing.module';
import { HomeComponent } from './home/home.component';
import { CategoryListComponent } from './category-list/category-list.component';
import { WishlistComponent } from './wishlist/wishlist.component';
import { CartComponent } from './cart/cart.component';
import { AdminLogin } from 'src/guards/admin-login.guard';
import { JwtModule } from '@auth0/angular-jwt';
import {MatExpansionModule} from '@angular/material/expansion';
import { MatPaginatorModule } from '@angular/material/paginator';
import {MatMenuModule} from '@angular/material/menu';
import {MatBadgeModule} from '@angular/material/badge';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { SpinnerInterceptor } from 'src/interceptor/spinner.interceptor';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { defineElement } from '@lordicon/element';
import lottie from 'lottie-web';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ChangePasswordComponent } from './changePassword/changePassword.component';
import { UserCabinetComponent } from './user-cabinet/user-cabinet.component';
import { ClientOrderComponent } from './client-order/client-order.component';
import { EditClientOrderComponent } from './client-order/edit-client-order/edit-client-order.component';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ProductDetailComponent } from './home/product-detail/product-detail.component';
import {MatIconModule} from '@angular/material/icon';
import { DailyMealComponent } from './daily-meal/daily-meal.component';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { ToastrModule } from 'ngx-toastr';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { ClientDashboardComponent } from './client-dashboard/client-dashboard.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { MatSortModule } from '@angular/material/sort';
import { NgxFileDropModule } from 'ngx-file-drop';
import { LuckyWheelComponent } from './wheel/lucky-wheel/lucky-wheel.component';

@NgModule({
  declarations: [
    PublicComponent,
    HomeComponent,
    CategoryListComponent,
    WishlistComponent,
    CartComponent,
    ChangePasswordComponent,
    UserCabinetComponent,
    ClientOrderComponent,
    EditClientOrderComponent,
    ProductDetailComponent,
    DailyMealComponent,
    ClientDashboardComponent,
    LuckyWheelComponent,
  ],
  imports: [
    CommonModule,
    AppRoutingModule,
    MatExpansionModule,
    MatPaginatorModule,
    MatMenuModule,
    MatBadgeModule,
    MatDialogModule,
    FormsModule,
    NgxSpinnerModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatIconModule,
    ClipboardModule,
    ToastrModule.forRoot(), // ToastrModule added
    MatCheckboxModule,
    InfiniteScrollModule,
    MatDatepickerModule,
    MatNativeDateModule ,
    MatFormFieldModule,
    MatButtonModule,
    NgApexchartsModule,
    NgxFileDropModule
  ],
  providers: [
    MatDatepickerModule,

    { provide: HTTP_INTERCEPTORS, useClass: SpinnerInterceptor, multi: true }

  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PublicModule {constructor() {
  defineElement(lottie.loadAnimation);
} }
