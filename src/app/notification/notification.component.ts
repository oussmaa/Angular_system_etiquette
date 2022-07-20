import { Component, OnInit } from '@angular/core';

import { Notification } from './Notification';
import { StompService } from './stomp.service';
@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {
  isCollapsed = false;
  public nbNotif: string ='';
  public notifications: Array<Notification> = [];
  public showNotification: boolean = false ;
   public hidden = false;
  constructor(  public stompService: StompService
   
   ) { }

  ngOnInit(): void {
    this.stompService.nbNotif.subscribe(data => {
      this.nbNotif = data.toString();
      if (data === 0){
        this.hidden = true;
      }
      else {
        this.hidden = false;
      }
      console.log('hidden ',  this.hidden);
    });
  }
  
  public openNotification(state: boolean) {
    this.get5LastNotifications();
    this.showNotification = state;
    if (state === true){
      this.stompService.initialize();
    }
  }
  
  get5LastNotifications() {
    this.stompService.getLastNotification().subscribe(notifications => {
      this.notifications = [];
      for (const notif of notifications) {
        console.log('notif m db', notif);
       // this.notifications.push(notif);
      }
    });
  }

}
