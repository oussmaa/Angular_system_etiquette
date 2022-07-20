import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import { Notification } from 'src/app/Shared/Notification';
 
import { getDay, getISOWeek, getMonth, getYear } from 'date-fns';
 
import { en_US, NzI18nService, zh_CN } from 'ng-zorro-antd/i18n';
 
import { MatTableDataSource } from '@angular/material/table';
import { Script } from 'vm';
import { NgToastService } from 'ng-angular-popup';

import { DatePipe } from '@angular/common';
import { Scripts } from '../produit/scripts/scripts';
import { StompService } from '../calendar/stomp.service';
import { ScriptsService } from '../produit/scripts/scripts.service';
import { Router } from '@angular/router';
 


@Component({
  selector: 'app-historique',
  templateUrl: './historique.component.html',
  styleUrls: ['./historique.component.css']
})
export class HistoriqueComponent implements OnInit {
  isVisible = false;
  LivraisonForm !: FormGroup;
  user:any;
  imageSrc:any;
  public nbNotif:number=0 ;
  showNumerNotif:boolean=true;

  Permission:any;
  isCollapsed = false;
  dataSource!: MatTableDataSource<any>;
  displayedColumns: string[] = ['version', 'date_livraison' ];
 
  public notifications: Array<Notification> = [];
  public showNotification: boolean = false ;
   public hidden = false;
   public scriptsList : Scripts[]=[];
   date = null;
   isEnglish = false;
   @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(private toast: NgToastService,private formBuilder : FormBuilder ,public ser:ApiService, public router:Router,  public stompService: StompService, private api : ScriptsService,private i18n: NzI18nService) { }
  
  get5LastNotifications() {
    this.ser.getNotif().subscribe(res => {
      this.notifications = res;
      this.nbNotif=this.notifications.length;
    });
  }
   ngOnInit(): void {
    this.Permission=JSON.parse(localStorage.getItem('Permission') || '{}'); 

    this.get5LastNotifications();
    this.getImage();
   this. getAllScripts();
    this.LivraisonForm = this.formBuilder.group({
     
      version : ['',Validators.required],
      date_livraison : ['',Validators.required],
      etat : ['',Validators.required],
      
    })
  }
  getImage()
  {
    this.user = JSON.parse(localStorage.getItem('user') || '{}'); 
  this.imageSrc="http://localhost:8065/api/downloadFile/"+this.user.id;
  

  } 
  changeEtat(data:any,id:any)
  {  
    console.log('onChange: ', id);
  
this.api.updateLivrasonLiv(id.id,data).subscribe(
  res => {
    this.toast.success({detail:"SUCCESS",summary:'Your Etat is Updated',duration:2000});
 

  },
   err=>{
    this.toast.error({detail:"ERROR",summary:err.error.message,duration:2000});

    alert(err.error.message)
  }
);
  }
  onChange(result: Date): void {
    console.log('onChange: ', result);
  }
  Logout()
  { 
    localStorage.removeItem('user');
    localStorage.clear();
    
    this.router.navigateByUrl('/login')
   
  }
  getAllScripts(){
    this.api.getScriptsH()
    .subscribe((res)=>{
      
    this.dataSource = new MatTableDataSource(res);
    this.dataSource.paginator = this.paginator;
    this.scriptsList = res;
 

   this.dataSource.sort = this.sort
    })
  } 
  applyFilter ( event: Event ) {
    const filterValue = (event.target as HTMLInputElement).value;
   this .dataSource.filter = filterValue.trim().toLowerCase();

   if ( this .dataSource.paginator) {
      this .dataSource.paginator.firstPage();
   }
 }
  getWeek(result: Date): void {
    console.log('week: ', getISOWeek(result));
  }
  openSuccess(event:any,id:any) {
    if(this.Permission==true)
    {
alert("Don't Have Permission")
    }
    else{

   
 
  
}

  
    }
 
  changeLanguage(): void {
    this.i18n.setLocale(this.isEnglish ? zh_CN : en_US);
    this.isEnglish = !this.isEnglish;
  }
  showModal(): void {
    this.isVisible = true;
  }

  handleCancel(): void {
    console.log('Button cancel clicked!');
    this.isVisible = false;
  }


  deleteScripts(scripts: Scripts):void {
    if(confirm('Are you sure to delete Version'))
    this.api.deleteScripts(scripts).subscribe(
      res=>{ 
      this.getAllScripts();}
    );  
    console.log('scripts',scripts)
 
 window.location.reload(); 
  }

  handleOk(): void {
    console.log(this.LivraisonForm.value);
    this.api.AddScript(this.LivraisonForm.value)
    .subscribe({
      next:(res)=>{
        alert("Livraison added successfully");
        this.LivraisonForm.reset();

      },
      error:()=>{
        alert("Error while adding the Livraison")
      }
    })
  /*  this.stompService.sendMessage(this.LivraisonForm.get('Name')?.value);
    window.location.reload();*/
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
