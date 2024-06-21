import { Component, OnInit } from '@angular/core';
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

  constructor(private globalService: GlobalService, public authService: AuthService) {
    authService.identityCheck();
  }

  ngOnInit(){
    this.globalService.getUnreadMessages().subscribe(res =>{
      this.messages = res.data

      this.showUnreadMessageAlertsSequentially(0);
    })
  }

  showUnreadMessageAlertsSequentially(index: number) {
    if (index < this.messages.length) {
      showInfoAlert('',this.messages[index].text, true, false, '', 'Ok').then((result) => {
        this.showUnreadMessageAlertsSequentially(index + 1);
      });
    }
  }
}
