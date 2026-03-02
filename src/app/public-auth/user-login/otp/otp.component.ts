import { Component, Inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { UserService } from 'src/services/user.service';
import { errorAlert, showErrorAlert, showSuccessAlert } from 'src/utils/alert';
// import $ = require("jquery");
import * as $ from 'jquery'
import { Router } from '@angular/router';
import { ResetPasswordComponent } from '../reset-password/reset-password.component';

@Component({
  selector: 'app-otp',
  templateUrl: './otp.component.html',
  styleUrls: ['./otp.component.scss']
})
export class OtpComponent {
  otpCode = new FormControl('');

  constructor(
    private login: UserService,
    private dialogRef: MatDialogRef<OtpComponent>,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private router: Router
  ) { }

  ngOnInit() {
  }

handleVerify() {
  if (!this.otpCode.value) return;

  const model = {
    userId: this.data.userId,
    otp: this.otpCode.value
  };

  if (this.data.mode === 'register') {

    this.login.registrationConfirmation(model).subscribe({
      next: res => {
        if (res.statusCode == 2021) {
          errorAlert(res.message);
        } else {
          showSuccessAlert(res.message);
          setTimeout(() => {
            window.location.reload();
          }, 1200);
        }
      },
      error: err => console.log(err),
      complete: () => this.onCloseDialog()
    });

  }

  else if (this.data.mode === 'forgotPassword') {

    this.login.registrationConfirmation(model).subscribe({
      next: res => {
        if (res.statusCode == 2021) {
          errorAlert(res.message);
        } else {

          //showSuccessAlert("OTP təsdiqləndi");

          this.onCloseDialog();

          this.dialog.open(ResetPasswordComponent, {
            width: '400px',
            panelClass: ['reset-dialog'],
            data: { userId: this.data.userId }
          });
        }
      },
      error: err => console.log(err)
    });

  }
}

  onCloseDialog() {
    this.dialogRef.close();
  }

}
