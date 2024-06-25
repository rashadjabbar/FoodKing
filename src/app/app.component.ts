import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { AuthService } from 'src/services/auth.service';
import { GlobalService } from 'src/services/global.service';
import { showInfoAlert } from 'src/utils/alert';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'FoodKing';
  messages: any =[]
url = ''
  constructor(private globalService: GlobalService, private authService: AuthService, private router: Router, private activatedRoute: ActivatedRoute) {
    authService.identityCheck();
  }

  ngOnInit(){
    this.router.events.subscribe((e) => {
      if (e instanceof NavigationEnd) {
        this.url = e.url;

        if(this.url!='/user-login' && this.url !='/login-adminpanel'){
          this.globalService.getUnreadMessages().subscribe(res =>{
            this.messages = res.data
      
            this.showUnreadMessageAlertsSequentially(0);
          });
        }
      }
    });
  }

  showUnreadMessageAlertsSequentially(index: number) {
    if (index < this.messages.length) {
      showInfoAlert('',this.messages[index].text, true, false, '', 'Ok').then((result) => {
        this.showUnreadMessageAlertsSequentially(index + 1);
      });
    }
  }
}
