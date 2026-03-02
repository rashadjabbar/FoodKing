import { Component, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UserService } from 'src/services/user.service';
import { errorAlert, showErrorAlert, showInfoAlert, showSuccessAlert } from 'src/utils/alert';



@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html'
})
export class ResetPasswordComponent {

  changeForm = this.fb.group({
    password: ['', Validators.required],
    confirmPassword: ['', Validators.required]
  });

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private dialogRef: MatDialogRef<ResetPasswordComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any
  ) {}

  resetPassword() {

    if (this.changeForm.value.password !== this.changeForm.value.confirmPassword) {
      showErrorAlert('Xəta', "Şifrələr uyğun deyil", false, false, '', '', 1500);
      return;
    }

    const model = {
      userId: this.data.userId,
      password: this.changeForm.value.password,
      ConfirmPassword: this.changeForm.value.confirmPassword
    };

    this.userService.resetPassword(model).subscribe(res => {
      if(!res?.status){
        showErrorAlert('', res?.message, false, false, '','', 1500);
      }
      else{
        this.dialogRef.close();
        showInfoAlert('', res?.message, false, false, '','', 2000);
      }
    })

  }
}