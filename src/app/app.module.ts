import { NgModule, CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PublicModule } from './public/public.module';
import { AdminModule } from './admin/admin.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { UnAuthorizedInterceptor } from 'src/environments/un-authorized.interceptor';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AdminAuthModule } from './admin-auth/admin-auth.module';
import { JwtModule } from '@auth0/angular-jwt';
import { NgxSpinnerModule } from 'ngx-spinner';
import { SpinnerInterceptor } from 'src/interceptor/spinner.interceptor';
import { PublicAuthModule } from './public-auth/public-auth.module';

export function tokenGetter() {
  return sessionStorage.getItem("token");
}

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    PublicModule,
    AdminModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    AdminAuthModule,
    PublicAuthModule,
    HttpClientModule,
    NgxSpinnerModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: ["192.168.37.49:3008" , "192.168.37.49:3005", "192.168.37.49:3007", "192.168.37.49:3010" , "192.168.37.49:3006" ],
      },
    }),
  ],

  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: SpinnerInterceptor, multi: true }
  ],

  bootstrap: [AppComponent],
})
export class AppModule { 
}
