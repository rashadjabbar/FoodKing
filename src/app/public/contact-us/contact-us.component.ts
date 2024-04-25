import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { NgxFileDropEntry } from 'ngx-file-drop';
import { GlobalService } from 'src/services/global.service';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss']
})
export class ContactUsComponent {

  constructor(
    private fb: FormBuilder,
    private globalService: GlobalService

  ) { }

  fileName?: string = ''
  //fileUrl = ''
  //selectedFiles: any = [];

  formData = new FormData();
  public files: NgxFileDropEntry[] = [];
  submitted = false;

  contactUsForm = this.fb.group({
    id: [0],
    subjectId: [null, Validators.required],
    content: ['', Validators.required]
  })

  ngOnInit() {

  }

  get Cf(): { [key: string]: AbstractControl } {
    return this.contactUsForm.controls;
  }

  contactUs(){
    this.submitted = true;
    if (this.contactUsForm.invalid) {
      return;
    }
    
    Object.keys(this.contactUsForm.controls).forEach((key: string) => {
      this.formData.append(key, this.contactUsForm.get(key)?.value)
    });

     this.globalService.saveContactUs(this.formData).subscribe(res => {

     })
  }



  public dropped(files: NgxFileDropEntry[]) {
    this.files = files;
    this.formData = new FormData();

    for (const droppedFile of files) {
      // Is it a file?
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
       
        fileEntry.file((file: File) => {
          this.formData.append('files', file, droppedFile.relativePath)
        });
      } else {
        // It was a directory (empty directories are added, otherwise only files)
        const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;
        console.log(droppedFile.relativePath, fileEntry);
      }
    }

  }
}
