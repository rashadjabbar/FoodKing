import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { UserService } from 'src/services/user.service';
import { OtpComponent } from '../otp/otp.component';
import { errorAlert } from 'src/utils/alert';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html'
})
export class ForgotPasswordComponent {

  emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$";

  forgotForm = this.fb.group({
    username: ['', Validators.required],
    email: ['', [Validators.required, Validators.pattern(this.emailPattern)]]
  });

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private dialogRef: MatDialogRef<ForgotPasswordComponent>,
    private dialog: MatDialog
  ) { }

  sendOtp() {

    if (this.forgotForm.invalid) return;

    this.userService.sendOtp(this.forgotForm.value).subscribe({
      next: (result: any) => {
        if (result.statusCode != 200) {
          errorAlert(result.message);
        } else {
          this.dialogRef.close();
          this.dialog.open(OtpComponent, {
            width: '1300px',
            data: {
              userId: result.data,
              mode: 'forgotPassword'
            }
          });
        }
      }
    });

  }
}