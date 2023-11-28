import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Product } from 'src/models/product';
import { ProductService } from 'src/services/product.service';
import { ProductCategoryComponent } from '../../product-category/product-category.component';
import Swal from 'sweetalert2';
import { ComboBox } from 'src/models/category';

@Component({
  selector: 'app-new-product',
  templateUrl: './new-product.component.html',
  styleUrls: ['./new-product.component.scss']
})
export class NewProductComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ProductCategoryComponent>,
    private formBuilder: FormBuilder,
    private productService: ProductService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  matcher = new ErrorStateMatcher();
  addData!: Product[];
  allCategory: ComboBox[] = []

  submitted = false;

  fileName?: string = ''
  fileUrl = ''

  selectedFile!: File;
  formData = new FormData();

  productForm = this.formBuilder.group({
    id: [0, Validators.required],
    subCategoryId: [0, Validators.required],
    name: ['', Validators.required],
    price: ['', Validators.required],
    fileName: ['', Validators.required],
    downloadKey: [''],
    status: [true],
  })


  get Tf(): { [key: string]: AbstractControl } {
    return this.productForm.controls;
  }

  ngOnInit() {
    this.getCommonFunc()
  }

  getCommonFunc() {
    this.productService.getAllSubCategory().subscribe({
      next: res => {
        this.allCategory = res.data
      }
    })
    if (this.data.id !== 0) {
      this.productService.getProductById(this.data.id).subscribe((res: any) => {
        this.productForm.patchValue(res.data[0])
        this.fileName = res.data[0].imageUrl
        this.fileUrl = res.data[0].imageUrl

        this.productForm.controls.fileName.clearValidators();
        this.productForm.controls.fileName.updateValueAndValidity();

      })
    }
  }

  getFile(event: any) {
    this.selectedFile = event.target.files[0];
    this.fileName = this.selectedFile.name
    this.productForm.controls.fileName.patchValue(this.fileName)

    this.formData.append('formFile', this.selectedFile)

  }

  productFunc() {
    this.submitted = true;
    if (this.productForm.invalid) {
      return;
    }
    Object.keys(this.productForm.controls).forEach((key: string) => {
      this.formData.append(key, this.productForm.get(key)?.value)
    });

    this.productService.postandputProduct(this.formData).subscribe(res => {
      this.dialogRef.close()
    })
  }



}
