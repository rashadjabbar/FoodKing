import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { NgxFileDropEntry } from 'ngx-file-drop';
import { ComboBox } from 'src/models/category';
import { GlobalService } from 'src/services/global.service';
import { showConfirmAlert, showErrorAlert, showInfoAlert } from 'src/utils/alert';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss']
})
export class ContactUsComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private globalService: GlobalService

  ) { }

  fileName?: string = ''
  subjects: ComboBox[] = []

  formData = new FormData();
  public files: NgxFileDropEntry[] = [];
  submitted = false;

  contactUsForm = this.fb.group({
    subjectId: [null, Validators.required],
    content: ['', Validators.required],
    email: ['', [Validators.email, Validators.required]]
  })

  ngOnInit() {
    this.globalService.getContactUsSubjects().subscribe({
      next: res => {
        this.subjects = res.data
      }
    })
  }

  get Cf(): { [key: string]: AbstractControl } {
    return this.contactUsForm.controls;
  }

  contactUs() {
    if (this.contactUsForm.invalid) {
      return;
    }

    showConfirmAlert('', "Göndərmək istədiyinizdən əminsinizmi?", undefined, undefined).then(res => {
      if (res.isConfirmed) {
        this.submitted = true;

        Object.keys(this.contactUsForm.controls).forEach((key: string) => {
          this.formData.append(key, this.contactUsForm.get(key)?.value)
        });

        this.globalService.saveContactUs(this.formData).subscribe(res => {
          if (!res?.status) {
            showErrorAlert('', 'Göndərildi!', false, false, '', '', 1500);
          }
          else {
            showInfoAlert('', res?.message, false, false, '', '', 2000);
            this.contactUsForm.reset()
            this.submitted = false;
            this.formData = new FormData();
          }
        })
      }
    })
  }



  public dropped(files: NgxFileDropEntry[]) {
    this.files = files;
    this.formData = new FormData();
    this.fileName = files[0].relativePath;

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
