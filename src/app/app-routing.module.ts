import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PublicComponent } from './public/public.component';
import { AdminComponent } from './admin/admin.component';
import { HomeComponent } from './public/home/home.component';
import { CategoryListComponent } from './public/category-list/category-list.component';
import { WishlistComponent } from './public/wishlist/wishlist.component';
import { CartComponent } from './public/cart/cart.component';
import { AddProductComponent } from './admin/product/product.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { ProductCategoryComponent } from './admin/product-category/product-category.component';
import { LoginComponent } from './admin-auth/login/login.component';
import { AdminLogin } from 'src/guards/admin-login.guard';
import { UserLoginComponent } from './public-auth/user-login/user-login.component';
import { PaymentComponent } from './admin/payment/payment.component';
import { OrderComponent } from './admin/order/order.component';
import { ClientOrderComponent } from './public/client-order/client-order.component';
import { DailyReportComponent } from './admin/daily-report/daily-report.component';
import { DailyMealComponent } from './public/daily-meal/daily-meal.component';
import { ReportComponent } from './admin/report/report.component';
import { ClientDashboardComponent } from './public/client-dashboard/client-dashboard.component';

const routes: Routes = [
  {
    path: '', component: PublicComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'category-list', component: CategoryListComponent },
      { path: 'wishlist', component: WishlistComponent },
      { path: 'cart', component: CartComponent },
      { path: 'client-order', component: ClientOrderComponent },
      { path: 'daily-meal', component: DailyMealComponent },
      { path: 'client-dashboard', component: ClientDashboardComponent },
    ]
  },
  {
    path: 'admin', component: AdminComponent, canActivate: [AdminLogin],
    children: [
      {path: '', redirectTo: 'products', pathMatch: 'full'},
      { path: 'dashboard', component: DashboardComponent },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'products', component: AddProductComponent },
      { path: 'product-category', component: ProductCategoryComponent },
      { path: 'payment', component: PaymentComponent },
      { path: 'order', component: OrderComponent },
      { path: 'daily-report', component: DailyReportComponent },
      { path: 'report', component: ReportComponent },
    ]
  },
  {path: 'login-adminpanel' , component: LoginComponent},
  {path: 'user-login' , component: UserLoginComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
