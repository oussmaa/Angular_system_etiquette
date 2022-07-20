import { Component, OnInit } from '@angular/core';
import { Notification } from 'src/app/Shared/Notification';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent implements OnInit {
  isCollapsed = false;
  constructor() { }
  public notifications: Array<Notification> = [];
  public showNotification: boolean = false ;
  public nbNotif: string ='';
 
   public hidden = false;
  ngOnInit(): void {
  }
  public openNotification(state: boolean) {
 
    this.showNotification = state;
    if (state === true){
 
    }
  }
}
