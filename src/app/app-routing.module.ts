import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PublicComponent } from './public/public.component';
import { AdminComponent } from './admin/admin.component';
import { HomeComponent } from './public/home/home.component';

const routes: Routes = [
  { path: '', component: PublicComponent,
  children: [
    { path: '', component: HomeComponent },
]  },
  { path: 'admin', component: AdminComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
