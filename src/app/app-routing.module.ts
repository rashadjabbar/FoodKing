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

const routes: Routes = [
  {
    path: '', component: PublicComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'category-list', component: CategoryListComponent },
      { path: 'wishlist', component: WishlistComponent },
      { path: 'cart', component: CartComponent },
    ]
  },
  {
    path: 'admin', component: AdminComponent, canActivate: [AdminLogin],
    children: [
      {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
      { path: 'dashboard', component: DashboardComponent },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'products', component: AddProductComponent },
      { path: 'product-category', component: ProductCategoryComponent }
    ]
  },
  {path: 'login-adminpanel' , component: LoginComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
