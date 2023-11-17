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

@NgModule({
  declarations: [
    PublicComponent,
    HomeComponent,
    CategoryListComponent,
    WishlistComponent,
    CartComponent,
    ChangePasswordComponent,
  ],
  imports: [
    CommonModule,
    AppRoutingModule,
    MatExpansionModule,
    MatPaginatorModule,
    MatMenuModule,
    MatBadgeModule,
    FormsModule,
    NgxSpinnerModule,
    ReactiveFormsModule

  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: SpinnerInterceptor, multi: true }

  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PublicModule {constructor() {
  defineElement(lottie.loadAnimation);
} }
