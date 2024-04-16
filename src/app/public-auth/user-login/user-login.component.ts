import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { UserService } from 'src/services/user.service';
import { Login } from 'src/models/login';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { OtpComponent } from './otp/otp.component';
import { ComboboxModel } from 'src/models/select-model';
import { SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { GoogleLoginProvider } from "@abacritt/angularx-social-login";
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.scss']
})
export class UserLoginComponent implements OnInit {

  constructor(private formBuilder: FormBuilder,
    private login: UserService,
    private dialog: MatDialog,
    private socialAuthService: SocialAuthService,
    private httpClient: HttpClient
  ) {
    this.socialAuthService.authState.subscribe((user: SocialUser) => {
      console.log(user);
    });
   }

  otp_dialogRef?: MatDialogRef<OtpComponent>;

  emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$";
  logindata: Login = new Login();
  private accessToken = '';
  gender?: ComboboxModel[];

  signUpForm = this.formBuilder.group({
    id: [0, Validators.required],
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    birthday: ['', Validators.required],
    username: ['', Validators.required],
    gender: [null, Validators.required],
    password: ['', Validators.required],
    email: ['', [Validators.required, Validators.pattern(this.emailPattern)]],
    phone1: ['', [Validators.required]],
  })

  loginForm = this.formBuilder.group({
    loginUsername: ['', Validators.required],
    loginPassword: ['', Validators.required],
  })

  get signUp(): { [key: string]: AbstractControl } {
    return this.signUpForm.controls;
  }

  get loginF(): { [key: string]: AbstractControl } {
    return this.loginForm.controls;
  }

  ngOnInit() {
    this.loadJsFile("../../../assets/js/login.js");
  }



  public loadJsFile(url) {
    let node = document.createElement('script');
    node.src = url;
    node.type = 'text/javascript';
    document.getElementsByTagName('head')[0].appendChild(node);
  }

  createUser() {
    if (this.signUpForm.invalid) {
      return;
    }
    this.signUp['gender'].setValue(Boolean(this.signUp['gender'].value));
    this.login.userRegister(this.signUpForm.value)

  } 

  loginFunc() {
    if (this.loginForm.invalid) {
      return;
    }

    this.logindata.username = this.loginForm.get('loginUsername')?.value!;
    this.logindata.password = this.loginForm.get('loginPassword')?.value!;
    this.login.login(this.logindata)
  }

}
