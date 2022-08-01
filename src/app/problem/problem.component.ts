import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StompService } from '../calendar/stomp.service';
import { ApiService } from '../services/api.service';
import { Notification } from '../Shared/Notification';
import { Problem } from './Problem';
 

@Component({
  selector: 'app-problem',
  templateUrl: './problem.component.html',
  styleUrls: ['./problem.component.css']
})
export class ProblemComponent implements OnInit {
  isCollapsed = false;
  public edited = false;
  public nbNotif:number=0 ;
  public notifications: Array<Notification> = [];
  public showNotification: boolean = false ;
   public hidden = false;
   showNumerNotif:boolean=true;
   public ProblemList : Problem[]=[];

   user:any;
   imageSrc:any;
  constructor(  public stompService: StompService,public router:Router,public ser:ApiService
   
   ) { }

   AfficheText(ed:any )
   {
    ed.visible=!ed.visible;
   }
   Logout()
   { 
     localStorage.removeItem('user');
     localStorage.clear();
     
     this.router.navigateByUrl('/login')
    
   }
   getAllprobem()
   {
    this.ser.getProblem()
    .subscribe((res)=>{
      
     this.ProblemList = res;

     })
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
    this.getAllprobem();
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

