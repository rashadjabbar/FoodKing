import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PublicComponent } from './public.component';
import { AppRoutingModule } from '../app-routing.module';
import { HomeComponent } from './home/home.component';



@NgModule({
  declarations: [
    PublicComponent,
    HomeComponent
  ],
  imports: [
    CommonModule,
    AppRoutingModule,

  ]
})
export class PublicModule { }
