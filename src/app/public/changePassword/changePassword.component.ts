import { Component, OnInit } from '@angular/core';
import { PublicComponent } from '../public.component';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-changePassword',
  templateUrl: './changePassword.component.html',
  styleUrls: ['./changePassword.component.scss']
})
export class ChangePasswordComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<PublicComponent>,
    private formBuilder: FormBuilder,

  ) { }

  passwordForm = this.formBuilder.group({
    password: ['', Validators.required],
    newPassword: ['' , Validators.required],
    confirmPassword: ['' , Validators.required],
  })

  ngOnInit() {
  }

}
