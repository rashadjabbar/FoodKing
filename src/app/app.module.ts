import { NgModule, CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PublicModule } from './public/public.module';
import { AdminModule } from './admin/admin.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { UnAuthorizedInterceptor } from 'src/environments/un-authorized.interceptor';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AdminAuthModule } from './admin-auth/admin-auth.module';
import { JwtModule } from '@auth0/angular-jwt';
import { NgxSpinnerModule } from 'ngx-spinner';
import { SpinnerInterceptor } from 'src/interceptor/spinner.interceptor';
import { PublicAuthModule } from './public-auth/public-auth.module';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { ToastrModule } from 'ngx-toastr';
import { MatSortModule } from '@angular/material/sort';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { UserLoginComponent } from './public-auth/user-login/user-login.component';
import { OtpComponent } from './public-auth/user-login/otp/otp.component';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { RouterModule } from '@angular/router';
import { IMaskModule } from 'angular-imask';
import { NgOtpInputModule } from 'ng-otp-input';


export function tokenGetter() {
  return localStorage.getItem("token");
}


@NgModule({
  declarations: [
    AppComponent,
    UserLoginComponent,
    OtpComponent

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
    // PublicAuthModule,
    HttpClientModule,
    NgxSpinnerModule,
    ClipboardModule,
    ToastrModule.forRoot(), // ToastrModule added
    MatSortModule,
    MatCheckboxModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: ["192.168.37.32:80", "192.168.37.32:443", "foodking.program.az"],
      },
    }),

    RouterModule,
    FormsModule,
    MatDatepickerModule,
    MatNativeDateModule ,
    IMaskModule,
    NgOtpInputModule,

  ],

  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: SpinnerInterceptor, multi: true },

  ],

  bootstrap: [AppComponent],
})
export class AppModule { 
}
