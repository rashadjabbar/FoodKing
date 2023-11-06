import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalService, User } from 'src/services/global.service';
import jwt_decode from 'jwt-decode';


@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit{

  constructor(private router: Router,
    private globalService: GlobalService){}

    userData?: User;

  ngOnInit(){
    this.userData = jwt_decode(sessionStorage.getItem('token')!)
    // if ( this.userData.userType == 1) {
    //   this.router.navigate(['/admin']);
    // }else this.router.navigate(['']);
   
  }

  logOut(){
    sessionStorage.removeItem('token')
    this.router.navigate(['/login-adminpanel']);
  }

}
