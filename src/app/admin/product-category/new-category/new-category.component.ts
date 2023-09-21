import { Component, Inject } from '@angular/core';
import { ProductCategoryComponent } from '../product-category.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ErrorStateMatcher } from '@angular/material/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CategoryService } from 'src/services/category.service';
import { Category } from 'src/models/category';
import Swal from 'sweetalert2';



@Component({
  selector: 'app-new-category',
  templateUrl: './new-category.component.html',
  styleUrls: ['./new-category.component.scss']
})
export class NewCategoryComponent {

  constructor(public dialogRef: MatDialogRef<ProductCategoryComponent>,
    private formBuilder: FormBuilder,
    private categoryService: CategoryService,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  matcher = new ErrorStateMatcher();
  addData!: Category[];
  submitted = false;

  requestData: any = {
    nextPageNumber: 1,
    visibleItemCount: 10,
  }


  categoryForm = this.formBuilder.group({
    id: [0, Validators.required],
    name: ['', Validators.required],
    status: [true],
  })


  get Tf(): { [key: string]: AbstractControl } {
    return this.categoryForm.controls;
  }

  ngOnInit() {
    this.getCommonFunc()
  }

  getCommonFunc() {
    if (this.data.id !== 0) {
      this.categoryService.getCategoryById(this.data.id).subscribe((res: any) => {
        this.categoryForm.patchValue(res.data[0])
      })
    }
  }

  categoryFunc() {
    this.submitted = true;
    if (this.categoryForm.invalid) {
      return;
    }

    this.categoryService.postandputCategory(this.categoryForm.value as Category).subscribe(res => {
      this.dialogRef.close()
      Swal.fire({
        icon: 'success',
        title: 'Uğurla əlavə olundu!',
        confirmButtonText: 'Bağla'
      })
    })

  }


}
