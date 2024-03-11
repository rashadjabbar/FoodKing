import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Product } from 'src/models/product';
import { ProductService } from 'src/services/product.service';
import { ProductCategoryComponent } from '../../product-category/product-category.component';
import Swal from 'sweetalert2';
import { ComboBox } from 'src/models/category';
import { environment } from 'src/environments/environments';
import { GlobalService } from 'src/services/global.service';

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
  ) { 
    this.imageIpUrl = environment.imageIpUrl
  }

  imageIpUrl!: string
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
    purchasePrice: ['', Validators.required],
    price: [''],
    salePercentage: [''],
    fileName: ['', Validators.required],
    downloadKey: [''],
    information: [''],
    currentAvailability: [''],
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

  getSalePrice(){
    this.productService.getSalePrice({subCategoryId: Number(this.productForm.controls['subCategoryId'].value), purchasePrice: Number(this.productForm.controls['purchasePrice'].value )}).subscribe((res: any) => {
       this.productForm.controls['price'].patchValue(res.data.salePrice);
       this.productForm.controls['salePercentage'].patchValue(res.data.percentage)
    })
  }


}
