import { Component, OnInit } from '@angular/core';
import { PublicComponent } from '../public.component';
import { MatDialogRef } from '@angular/material/dialog';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { UserService } from 'src/services/user.service';
import { ChangePasswordModel } from 'src/models/changePassword';
import { showErrorAlert, showInfoAlert } from 'src/utils/alert';
import { Router } from '@angular/router';
import { AuthService } from 'src/services/auth.service';

@Component({
  selector: 'app-changePassword',
  templateUrl: './changePassword.component.html',
  styleUrls: ['./changePassword.component.scss']
})
export class ChangePasswordComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ChangePasswordComponent>,
    private formBuilder: FormBuilder,
    private userService: UserService,
     private router: Router,
     private authService: AuthService
  ) { }
  showOldPassword: boolean=false
  showPassword: boolean=false
  showConfirmPassword: boolean=false

  formSubmitted: boolean = false

  passwordForm = this.formBuilder.group({
    oldPassword: ['' , Validators.required],
    password: ['', Validators.required],
    confirmPassword: ['' , Validators.required],
  })

  get cf(): { [key: string]: AbstractControl } {
    return this.passwordForm.controls;
  }

  ngOnInit() {
  }

  switchPasswordInput(inputId: string){
    let input = document.getElementById(inputId)
   
    if(input?.getAttribute('type') == 'text')
      input!.setAttribute('type','password')
    else
    input!.setAttribute('type','text')

    if(inputId == 'oldPassword')
      this.showOldPassword = !this.showOldPassword
    else if(inputId == 'password')
      this.showPassword = !this.showPassword
    else if(inputId == 'confirmPassword')
      this.showConfirmPassword = !this.showConfirmPassword
  }
  
  changePassword(){
    this.formSubmitted = true;
    
    if(!this.passwordForm.valid || this.cf['password'].value != this.cf['confirmPassword'].value){
      return;
    }

    this.userService.changePassword(this.passwordForm.value as ChangePasswordModel).subscribe(res => {
      console.log(res)

      if(res?.statusCode == 2023 || res?.statusCode == 2015){
        showErrorAlert('', res?.message, false, false, '','', 1500);
      }
      else{
        showInfoAlert('', res?.message, false, false, '','', 2000);
        sessionStorage.removeItem('token')
        this.authService.identityCheck();
        this.dialogRef.close()
        this.router.navigateByUrl('user-login')
      }
    })
  }
}
