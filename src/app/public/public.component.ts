import { Component, ElementRef, ViewChild } from '@angular/core';
import { ComboBox } from 'src/models/category';
import { CategoryService } from 'src/services/category.service';
import { Router } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { GlobalService, User } from 'src/services/global.service';
import { BasketService } from 'src/services/public/basket.service';
import { MatMenuTrigger } from '@angular/material/menu';
import jwt_decode from 'jwt-decode';
import { showConfirmAlert, showErrorAlert, showInfoAlert } from 'src/utils/alert';
import { SaveOrder } from 'src/models/save-order';
import { AuthService, _isAuthenticated } from 'src/services/auth.service';
import { ChangePasswordComponent } from './changePassword/changePassword.component';
import { MatDialog } from '@angular/material/dialog';
import { UserService } from 'src/services/user.service';
import { UserCabinetComponent } from './user-cabinet/user-cabinet.component';
import { environment } from 'src/environments/environments';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { ToastrService } from 'ngx-toastr';
import { NgxFileDropEntry } from 'ngx-file-drop';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-public',
  templateUrl: './public.component.html',
  styleUrls: ['./public.component.scss'],


})

export class PublicComponent {
  constructor(
    private router: Router,
    private basketService: BasketService,
    private categoryServices: CategoryService,
    private authService: AuthService,
    private dialog: MatDialog,
    private loginService: UserService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private globalService: GlobalService
  ) {
    this.imageIpUrl = environment.imageIpUrl
  }

  @ViewChild(MatMenuTrigger) trigger!: MatMenuTrigger;
  @ViewChild('menuTrigger') menuTrigger!: MatMenuTrigger;
  message: any;
  totalBasketAmount?: number = 0;
  basketAmount?: number = 0;
  serviceFee?: number = 0;
  orderData: SaveOrder = { orderItems: [] }
  year = new Date().getFullYear();

  imageIpUrl!: string;
  categories: ComboBox[] = []
  basketItems: any = []

  userData?: User
  isAuthenticated: boolean = false;
  balance: number = 0;

  loginnedUser = localStorage.getItem('token')

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
    this.authService.identityCheck();
    this.isAuthenticated = _isAuthenticated;

    this.getCategories()

    if (this.isAuthenticated) {
      this.getBasket()
      this.getUserData()

      this.globalService.basketObservable$.subscribe(res => {
        this.getBasket()
      })

      this.getUserBalance();
    }

    this.loadJsFile('../../../assets/js/app.js')
  }

  playNotification() {
    //if (localStorage.getItem('sound') == 'true') {
    let audio = new Audio();
    audio.autoplay = true
    audio.src = "../../../assets/audio/notification.mp3";
    audio.load();
    audio.play();
    //}
  }

  public loadJsFile(url) {
    let node = document.createElement('script');
    node.src = url;
    node.type = 'text/javascript';
    document.getElementsByTagName('head')[0].appendChild(node);
  }

  getUserData() {
    this.userData = jwt_decode(localStorage.getItem('token')!)
  }

  getUserBalance() {
    this.globalService.getUserBalance().subscribe((res: any) => {
      this.balance = res.data
    })
  }

  getCategories() {
    this.categoryServices.getAllCategory().subscribe((res: any) => {
      this.categories = res.data
    })
  }

  browseCategory(category: any) {
    this.globalService.getCategoryId({ catId: category });
    this.router.navigate(['/'], { fragment: 'products' });

    setTimeout(() => {
      var elements = document.getElementById('products');
      elements?.scrollIntoView();
    }, 300);

  }

  getBasket() {
    this.basketService.getBasket().subscribe(res => {
      this.basketItems = res.data.basketItems
      this.basketAmount = res.data.amountInfo?.amount;
      this.serviceFee = res.data.amountInfo?.serviceFee;

      this.totalBasketAmount = isNaN(this.basketAmount! + this.serviceFee!) ? 0 : this.basketAmount! + this.serviceFee!;

      if (this.basketItems.length > 0 && localStorage.getItem('notificationPlayed') == 'false') {
        setTimeout(() => {
          if(this.basketItems.length > 0 && localStorage.getItem('notificationPlayed') == 'false'){
            this.playNotification()
            localStorage.setItem('notificationPlayed', 'true')
            showInfoAlert('','Sifarişi təsdiqləmək zamanı gəldi😋', true, false, '', 'Ok')
            this.menuTrigger.openMenu()
          }
      }, 5*60*1000); //5 minutes
      }
    })
  }

  removeBasketItem(id: number) {
    showConfirmAlert('', "Seçilmiş sətri silmək istədiyinizdən əminsinizmi?", undefined, undefined).then(res => {
      if (res.isConfirmed) {
        this.basketService.removeBasketItem(id).subscribe(res => {
          this.getBasket();
        })
      }
    })

  }

  closeBasket() {
    this.menuTrigger.closeMenu();
  }

  submitOrder() {
    showConfirmAlert('', "Sifariş etmək istədiyinizdən əminsinizmi?", undefined, undefined).then(res => {
      if (res.isConfirmed) {
        this.orderData!.id = 0
        this.orderData!.serviceFee = this.serviceFee
        this.orderData!.amount = this.basketAmount

        this.basketItems.map((item: any) => {
          this.orderData.orderItems!.push({
            productId: item.productId,
            productName: item.name,
            count: item.count,
            price: item.price,
          })
        });


        this.basketService.SaveOrder(this.orderData!).subscribe(res => {
          showInfoAlert('', "Sifariş qəbul edildi", false, false, 'Bağla', '', 1000);
          this.getBasket();
          this.orderData.orderItems = []
        })
      }
    });
  }

  showChangePasswordDialog() {
    const dialogRef = this.dialog.open(ChangePasswordComponent, {
      height: 'max-content',
      width: '20%',
      panelClass: "dialog-change-password",
      hasBackdrop: true,
      disableClose: true
    })

    dialogRef.afterClosed().subscribe(result => {

    });
  }

  showCabinetDialog() {
    const dialogRef = this.dialog.open(UserCabinetComponent, {
      height: 'max-content',
      width: '35%',
      panelClass: "dialog-user-cabinet",
      hasBackdrop: true,
      disableClose: true
    })

    dialogRef.afterClosed().subscribe(result => {

    });
  }

  logOut() {
    if (_isAuthenticated) {
      this.loginService.logout().subscribe(res => {
        localStorage.removeItem('token')
        this.authService.identityCheck();
        this.isAuthenticated = _isAuthenticated;
        this.router.navigate(['']);
      })
    } else {
      localStorage.removeItem('token')
      this.authService.identityCheck();
      this.isAuthenticated = _isAuthenticated;
      this.router.navigate(['']);
    }

  }


  copyCard() {
    this.toastr.success('Ödəniş üçün kart kopyalandı!', '', {
      positionClass: 'toast-bottom-right'
    });
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
            showErrorAlert('Xəta', res?.message, false, false, '', '', 1500);
          }
          else {
            showInfoAlert('', 'Göndərildi', false, false, '', '', 2000);
            this.contactUsForm.reset()
            this.submitted = false;
            this.formData = new FormData();
            this.files = []
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
