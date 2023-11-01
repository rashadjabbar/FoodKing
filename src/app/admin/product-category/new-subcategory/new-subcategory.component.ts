import { Component, Inject } from '@angular/core';
import { FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AllCategory, SubCategory } from 'src/models/category';
import { CategoryService } from 'src/services/category.service';
import Swal from 'sweetalert2';
import { ProductCategoryComponent } from '../product-category.component';

@Component({
  selector: 'app-new-subcategory',
  templateUrl: './new-subcategory.component.html',
  styleUrls: ['./new-subcategory.component.scss']
})
export class NewSubcategoryComponent {
  constructor(public dialogRef: MatDialogRef<ProductCategoryComponent>,
    private formBuilder: FormBuilder,
    private categoryService: CategoryService,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  matcher = new ErrorStateMatcher();
  allCategory: AllCategory[] = []
  addData!: SubCategory[];
  submitted = false;

  requestData: any = {
    nextPageNumber: 1,
    visibleItemCount: 10,
  }


  categoryForm = this.formBuilder.group({
    id: [0, Validators.required],
    categoryId: [0, Validators.required],
    name: ['', Validators.required],
  })


  get Tf(): { [key: string]: AbstractControl } {
    return this.categoryForm.controls;
  }

  ngOnInit() {
    this.getCommonFunc()
  }

  getCommonFunc() {
    this.categoryService.getAllCategory().subscribe({
      next: res => {
        this.allCategory = res.data
      }
    })
    if (this.data.id !== 0) {
      this.categoryService.GetSubCategoryById(this.data.id).subscribe((res: any) => {
        this.categoryForm.patchValue(res.data[0])
      })
    }
  }

  categoryFunc() {
    this.submitted = true;
    if (this.categoryForm.invalid) {
      return;
    }

    this.categoryService.saveSubCategory(this.categoryForm.value as SubCategory).subscribe(res => {
      this.dialogRef.close()
      Swal.fire({
        icon: 'success',
        title: 'Uğurla əlavə olundu!',
        confirmButtonText: 'Bağla'
      })
    })

  }
}
