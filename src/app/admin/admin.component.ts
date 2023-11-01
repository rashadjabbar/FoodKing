import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalService } from 'src/services/global.service';
@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit{

  constructor(private router: Router,
    private globalService: GlobalService){}

  ngOnInit(){
    this.globalService.userData$.subscribe(res => {
      console.log(res.userType)
      if ( res.userType == 1) {
        this.router.navigate(['/admin']);
      }else this.router.navigate(['']);
    })
   
  }

  logOut(){
    sessionStorage.removeItem('token')
    this.router.navigate(['/login-adminpanel']);
  }

}
