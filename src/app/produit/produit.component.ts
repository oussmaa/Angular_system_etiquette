import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as Chart from 'chart.js';
import { User } from '../configuration/user/user';
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
   public userList : string[]=[];
   public datalength:number[]=[];
   showNumerNotif:boolean=true;
nb:any;
nb2:any;
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

         
    this.ser.getEventByUsername("value").subscribe((res)=>{
         
        
    
   
      var data3 = {
        labels: this.userList,
        datasets: [{
          label: 'Event By Users',
          data: res,
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(255, 159, 64, 0.2)',
            'rgba(255, 205, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(201, 203, 207, 0.2)'
          ],
          borderColor: [
            'rgb(255, 99, 132)',
            'rgb(255, 159, 64)',
            'rgb(255, 205, 86)',
            'rgb(75, 192, 192)',
            'rgb(54, 162, 235)',
            'rgb(153, 102, 255)',
            'rgb(201, 203, 207)'
          ],
          borderWidth: 1
        }]
        ,options: {
          scales: {
              y: {
                  beginAtZero: true
              }
          }
      }
      };
      var myChart3 = new Chart("myChart3", {
        type: 'bar',
        data:  data3,  
        
         
          
      
      });
     }
  
      );
 

    this.ser.getUser()
    .subscribe((res)=>{
      res.forEach((xx: { username: any; }) => {
        this.userList.push(xx.username);
        
      });
    });

    this.ser.getUserAndAdmin().subscribe(res => {
 
      const data = {
        labels: [
          'User',
          'Admin',
          
        ],
        datasets: [{
          label: 'Users Roles',
          data: [res[0], res[1]],
          backgroundColor: [
            'rgb(255, 99, 132)',
            'rgb(54, 162, 235)',
            'rgb(255, 205, 86)'
          ],
          hoverOffset: 4
        }]
      };
      const myChart = new Chart("myChart", {
        type: 'doughnut',
        data:  data,
    
    });
    });



      
       
  
    this.ser.getetatlivraison().subscribe(res => {

      const data2 = {
        labels: [
          'Terminer',
          'En cour ',
          'En Attente'
    
        ],
        datasets: [{
          label: 'Tiket in Livraison',
          data:res,
          fill: true,
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderColor: 'rgb(255, 99, 132)',
          pointBackgroundColor: 'rgb(255, 99, 132)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgb(255, 99, 132)'
        },  ]
      };
  
  
  
       const myChart2 = new Chart("myChart2", {
        type: 'radar',
        data:  data2,
    
    });


    });
       

 
  
 
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
function dd(dd: any) {
  throw new Error('Function not implemented.');
}

