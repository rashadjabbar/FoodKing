import { Component, Inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UserService } from 'src/services/user.service';
import { errorAlert, showErrorAlert, showSuccessAlert } from 'src/utils/alert';
// import $ = require("jquery");
import * as $ from 'jquery'

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
    @Inject(MAT_DIALOG_DATA) private data: any,
  ) { }

  ngOnInit() {
  }

  handleVerify() {
    if (this.otpCode.value) {
      let model = {
        userId: this.data.userId,
        otp: this.otpCode.value
      }
      this.login.registrationConfirmation(model).subscribe({
        next: res => {
          if (res.statusCode == 2021) {
            errorAlert(res.message);
          }
          else {
            showSuccessAlert(res.message);
          }
        },
        error: err => console.log(err),
        complete: () => {
          this.onCloseDialog();
        }
      })
    }
  }

  onCloseDialog() {
    this.dialogRef.close();
  }

}
