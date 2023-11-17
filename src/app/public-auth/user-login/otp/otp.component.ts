import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-otp',
  templateUrl: './otp.component.html',
  styleUrls: ['./otp.component.scss']
})
export class OtpComponent {
  otpCode = new FormControl('');

  constructor(
    private dialogRef: MatDialogRef<OtpComponent>,
  ) {  }

  ngOnInit() {

  }

  onCloseDialog() {
    this.dialogRef.close();
  }

}
