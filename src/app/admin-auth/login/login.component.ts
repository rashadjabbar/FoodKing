import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Login, LoginResult } from 'src/models/login';
import { GlobalService } from 'src/services/global.service';
import { UserService } from 'src/services/user.service';
import { showInfoAlert } from 'src/utils/alert';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  constructor(private formBuilder: FormBuilder,
    private login: UserService,
    private globalService: GlobalService,
    private router: Router,
    private titleService: Title) { }


  logindata: Login = new Login();
  pageTitle = 'Daxil ol'
  submitted = false;

  loginned!: boolean;

  loginForm = new FormGroup({
    username: new FormControl(''),
    password: new FormControl('')
  })

  ngOnInit() {
    this.titleService.setTitle(this.pageTitle);
    this.logForm()
  }

  // LOGIN VALIDATION
  logForm() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    })
  }
  get Lf(): { [key: string]: AbstractControl } {
    return this.loginForm.controls;
  }

  loginFunc() {
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    }

    this.logindata.username = this.loginForm.get('username')?.value!;
    this.logindata.password = this.loginForm.get('password')?.value!;

    this.login.login(this.loginForm.value)
  }

}
