import { Component, Inject } from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { environment } from 'src/environments/environments';
import { ContactUsService } from 'src/services/contactUs.service';

@Component({
  selector: 'app-view-contact-us',
  templateUrl: './view-contact-us.component.html',
  styleUrls: ['./view-contact-us.component.scss']
})
export class ViewContactUsComponent {
  constructor(
    public dialogRef: MatDialogRef<ViewContactUsComponent>,
    private formBuilder: FormBuilder,
    public contactUsService: ContactUsService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { 
    this.imageIpUrl = environment.imageIpUrl
  }

  imageIpUrl!: string
  matcher = new ErrorStateMatcher();

  fileName?: string = ''
  fileUrl = ''

  selectedFile!: File;
  formData = new FormData();

  contactUsForm = this.formBuilder.group({
    username: [0, Validators.required],
    email: [0, Validators.required],
    subject: ['', Validators.required],
    content: ['', Validators.required],
    imageUrl: [''],
  })


  get Tf(): { [key: string]: AbstractControl } {
    return this.contactUsForm.controls;
  }


  ngOnInit() {
    this.getCommonFunc()
  }


  getCommonFunc() {
    if (this.data.id !== 0) {
      this.contactUsService.getContactUsById(this.data.id).subscribe((res: any) => {
        this.contactUsForm.patchValue(res.data)
      })
    }
  }

  getFile(event: any) {
    this.selectedFile = event.target.files[0];
    this.fileName = this.selectedFile.name
    //this.productForm.controls.fileName.patchValue(this.fileName)

    this.formData.append('formFile', this.selectedFile)

  }


}
