import { Component, OnInit } from '@angular/core';
import { loginJs } from '../../../assets/js/login.js';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { LoginService } from 'src/services/login.service';
import { Login } from 'src/models/login';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.scss']
})
export class UserLoginComponent implements OnInit {

  constructor(private formBuilder: FormBuilder,
    private login: LoginService,) { loginJs }

  emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$";
  logindata: Login = new Login();

  signUpForm = this.formBuilder.group({
    id: [0, Validators.required],
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    birthday: ['', Validators.required],
    username: ['', Validators.required],
    password: ['', Validators.required],
    email: ['', [Validators.required, Validators.pattern(this.emailPattern)]],
    phone1: ['', [Validators.required ]],
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

  }

  createUser(){
    if (this.signUpForm.invalid) {
      return;
    }
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
