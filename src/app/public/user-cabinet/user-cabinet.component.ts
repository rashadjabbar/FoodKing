import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ComboboxModel } from 'src/models/select-model';
import { AuthService } from 'src/services/auth.service';
import { UserService } from 'src/services/user.service';
import { showErrorAlert, showInfoAlert } from 'src/utils/alert';

@Component({
  selector: 'app-user-cabinet',
  templateUrl: './user-cabinet.component.html',
  styleUrls: ['./user-cabinet.component.scss'],
})
export class UserCabinetComponent {
  constructor(
    public dialogRef: MatDialogRef<UserCabinetComponent>,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router,
    private authService: AuthService,
    public datepipe: DatePipe
  ) { }

  formSubmitted: boolean = false
  emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$";

  cabinetForm = this.formBuilder.group({
    id: [0, Validators.required],
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    birthday: ['', Validators.required],
    username: ['', Validators.required],
    email: ['', [Validators.required, Validators.pattern(this.emailPattern)]],
    phone1: [''],
    subscription: ['']
  })

  get cf(): { [key: string]: AbstractControl } {
    return this.cabinetForm.controls;
  }

  ngOnInit() {
    this.getUserInfo();
  }

  getUserInfo(){
    this.userService.getUserInfo().subscribe(res => {
    this.cabinetForm.patchValue(res.data)
    this.cf['birthday'].patchValue(this.datepipe.transform(res.data.birthday, 'yyyy-MM-dd'))
    })
  }

  saveUserInfo() {
    this.formSubmitted = true;

    if (!this.cabinetForm.valid) {
      return;
    }

    this.userService.saveUserInfo(this.cabinetForm.value).subscribe(res => {
      if(!res?.status){
        showErrorAlert('', res?.message, false, false, '','', 1500);
      }
      else{
        showInfoAlert('', res?.message, false, false, '','', 2000);
        this.dialogRef.close()
      }
    })
  }
}
