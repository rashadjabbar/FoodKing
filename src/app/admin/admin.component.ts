import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalService, User } from 'src/services/global.service';
import jwt_decode from 'jwt-decode';
import { LoginService } from 'src/services/login.service';
import { AuthService, _isAuthenticated } from 'src/services/auth.service';


@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit{

  constructor(private router: Router,
    private globalService: GlobalService,
    private loginService: LoginService,
    private authService: AuthService
    ){}

    userData?: User;

  ngOnInit(){

    this.loadJsFile('../../../assets/admin/js/app.js')
  }

  public loadJsFile(url) {  
    let node = document.createElement('script');  
    node.src = url;  
    node.type = 'text/javascript';  
    document.getElementsByTagName('head')[0].appendChild(node);  
  }  

  logOut(){
    if(_isAuthenticated){
      this.loginService.logout().subscribe(res =>{
        sessionStorage.removeItem('token')
        this.authService.identityCheck();
        this.router.navigate(['/login-adminpanel']);
      })
    }else{
      sessionStorage.removeItem('token')
      this.authService.identityCheck();
      this.router.navigate(['/login-adminpanel']);
    }
  }
}
