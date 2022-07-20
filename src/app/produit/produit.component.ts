import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { Notification } from '../Shared/Notification';
import { StompService } from './stomp.service';
@Component({
  selector: 'app-produit',
  templateUrl: './produit.component.html',
  styleUrls: ['./produit.component.css']
})
export class ProduitComponent implements OnInit {
  isCollapsed = false;
  public nbNotif:number=0 ;
  public notifications: Array<Notification> = [];
  public showNotification: boolean = false ;
   public hidden = false;
   showNumerNotif:boolean=true;

   user:any;
   imageSrc:any;
  constructor(  public stompService: StompService,public router:Router,public ser:ApiService
   
   ) { }
   Logout()
   { 
     localStorage.removeItem('user');
     localStorage.clear();
     
     this.router.navigateByUrl('/login')
    
   }
   getImage()
   {
     this.user = JSON.parse(localStorage.getItem('user') || '{}'); 
   this.imageSrc="http://localhost:8065/api/downloadFile/"+this.user.id;
   
 
   } 
   get5LastNotifications() {
    this.ser.getNotif().subscribe(res => {
      this.notifications = res;
      this.nbNotif=this.notifications.length;
    });
  }
  ngOnInit(): void {
    this.get5LastNotifications();
    this.getImage();
 
  }
  
  public openNotification(state: boolean) {
    this.get5LastNotifications();
    this.showNotification = state;
    if(state==true)
    {
      this.showNumerNotif=false;
    }
    else{
      this.showNumerNotif=true;

    }
  }
 
}
