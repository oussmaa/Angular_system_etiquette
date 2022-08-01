import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
 
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
 
import { MatTableDataSource } from '@angular/material/table';
import { Script } from 'vm';
import { NgToastService } from 'ng-angular-popup';
import { Notification } from 'src/app/Shared/Notification';

import { StompService } from './stomp.service';
import { getISOWeek } from 'date-fns';

import { en_US, NzI18nService, zh_CN } from 'ng-zorro-antd/i18n';
import { Scripts } from '../scripts/scripts';
import { ScriptsService } from '../scripts/scripts.service';
import { Router } from '@angular/router';
export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}
const ELEMENT_DATA: PeriodicElement[] = [
  { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
  
];
@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})

export class TestComponent implements OnInit {
  isVisible = false;
  LivraisonForm !: FormGroup;
  Permission:any;
  showNumerNotif:boolean=true;

  isCollapsed = false;
  dataSource!: MatTableDataSource<any>;
  displayedColumns: string[] = ['version', 'date_livraison','date_generation','etat', 'action'  ];
  public nbNotif:number=0 ;
  public notifications: Array<Notification> = [];
  public showNotification: boolean = false ;
   public hidden = false;
   public scriptsList : Scripts[]=[];
   date = null;
   isEnglish = false;
   user:any;
   imageSrc:any;
   @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(private toast: NgToastService,public ser:ApiService, private formBuilder : FormBuilder ,public router:Router,  public stompService: StompService, private api : ScriptsService,private i18n: NzI18nService) { }
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
  onChange(result: Date): void {
    console.log('onChange: ', result);
  }
  openSuccess(event:any,id:any) {
    if (id.etat=="Terminer")
    {
    this.api.sendEmail(id.version).subscribe(
      res => {
        this.toast.success({detail:"SUCCESS",summary:'Your Success Message',duration:2000});

      }
      ,err=>{
        this.toast.error({detail:"ERROR",summary:err.error.message,duration:2000});

      }



    );
    }
    else{
      this.toast.error({detail:"ERROR",summary:'Your Etat is Not Terminer For Send Email',duration:2000});

  }


  
    }
    changeEtat(data:any,id:any)
    {  //let etat=this.registerForm.controls['etat'].value;
      console.log('onChange: ', id);
  this.api.updateLivrasonTest(id.id,data).subscribe(
    res => {
      this.toast.success({detail:"SUCCESS",summary:'Your Etat is Updated',duration:2000});
  //this.getAllScripts();
    //  this.router.navigateByUrl('/login')
  
    },
     err=>{
      this.toast.error({detail:"ERROR",summary:err.error.message,duration:2000});
  
      alert(err.error.message)
    }
  );
    }
    Logout()
    { 
      localStorage.removeItem('user');
      localStorage.clear();
      
      this.router.navigateByUrl('/login')
     
    }
  getAllScripts(){
    this.api.getScriptsB()
    .subscribe((res)=>{
      
    this.dataSource = new MatTableDataSource(res);
    this.dataSource.paginator = this.paginator;
    this.scriptsList = res;

    /*this.scriptsList.map(elem=>{
      let dat =elem.date_generation;
      elem.date_generation = new Date(dat.getFullYear(),dat.getMonth(),dat.getDay());
    })*/

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
      ()=>{ 
      this.getAllScripts();}
    );  
    console.log('scripts',scripts)
 
 window.location.reload(); 
  }

  handleOk(): void {
    console.log(this.LivraisonForm.value);
    this.api.AddScript(this.LivraisonForm.value)
    .subscribe({
      next:()=>{
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
