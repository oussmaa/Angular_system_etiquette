import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import { Notification } from 'src/app/Shared/Notification';
import { StompService } from './stomp.service';
import { getDay, getISOWeek, getMonth, getYear, max } from 'date-fns';
import { Scripts } from './scripts';
import { en_US, NzI18nService, zh_CN } from 'ng-zorro-antd/i18n';
import { ScriptsService } from './scripts.service';
import { MatTableDataSource } from '@angular/material/table';
import { Script } from 'vm';
import { NgToastService } from 'ng-angular-popup';

import { DatePipe } from '@angular/common';
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
  selector: 'app-scripts',
  templateUrl: './scripts.component.html',
  styleUrls: ['./scripts.component.css']
})
export class ScriptsComponent implements OnInit {
  isVisible = false;
  visibleProblem=false;
  LivraisonForm !: FormGroup;
  ProblemForm!:FormGroup;
  isCollapsed = false;
  etat!:FormControl;
  registerForm!:FormGroup;
  script:any;
  Permission:any;
  showNumerNotif:boolean=true;
  Version:any;
  test:boolean=false;
  dataSource!: MatTableDataSource<any>;
  displayedColumns: string[] = ['version', 'date_livraison','date_generation','etat', 'action','Alert_Problem'  ];
  public nbNotif:number=0 ;
  public notifications: Array<Notification> = [];
  public showNotification: boolean = false ;
   public hidden = false;
   user:any;
   imageSrc:any;
   public scriptsList : Scripts[]=[];
   date = null;
   selectede :string='';

   isEnglish = false;
   etats = [
    {value: 'En cours', viewValue: 'En cours'},
    {value: 'Terminer', viewValue: 'Terminer'},
 
  ];

   @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(private toast: NgToastService,public ser:ApiService, private formBuilder : FormBuilder ,public router:Router, public stompService: StompService, private api : ScriptsService,private i18n: NzI18nService) {            
 
 
    this.ProblemForm = new FormGroup({
      object: new FormControl(),
      description: new FormControl()
  });
 
  this.ProblemForm = this.formBuilder.group({
     
    object : ['',Validators.required ],
    description : ['',Validators.required],
 
    
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
    this.Permission=JSON.parse(localStorage.getItem('Permission') || '{}'); 

    this.get5LastNotifications();
    this.getImage();
    var te = JSON.parse(localStorage.getItem('test') || '{}'); 
console.log(te)
   this.getAllScripts();
   this.test=true;

    this.LivraisonForm = this.formBuilder.group({
     
      version : ['',Validators.required,Validators.minLength(6),],
      date_livraison : ['',Validators.required],
      etat : ['',Validators.required],
      
    })
  }
  onChange(result: Date): void {
    console.log('onChange: ', result);
  }

  changeEtat(data:any,id:any)
  {  //let etat=this.registerForm.controls['etat'].value;
    console.log('onChange: ', id);
    console.log(this.test)
this.api.updateLivrason(id.id,data).subscribe(
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
  changeEtat2(id:any)
  {  let etat=this.registerForm.controls['etat'].value;
    console.log('onChange2: ', etat);
    console.log(this.test)

/*this.api.updateLivrason(id.id,etat).subscribe(
  res => {
    this.toast.success({detail:"SUCCESS",summary:'Your Etat is Updated',duration:2000});
    //this.getAllScripts();
  //  this.router.navigateByUrl('/login')

  },
   err=>{
    this.toast.error({detail:"ERROR",summary:err.error.message,duration:2000});

    alert(err.error.message)
  }
);*/
  }

  getAllScripts(){
    this.api.getScripts()
    .subscribe((res)=>{
      
    this.dataSource = new MatTableDataSource(res);
    this.dataSource.paginator = this.paginator;
    this.scriptsList = res;

   this.dataSource.sort = this.sort
    })
    this.test=false;

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

  openProblem(event:any,id:any)
  {

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
    
  changeLanguage(): void {
    this.i18n.setLocale(this.isEnglish ? zh_CN : en_US);
    this.isEnglish = !this.isEnglish;
  }
  showModalProblem(row:any): void {
    this.Version=row.version;
    this.visibleProblem = true;
  }
  showModal(): void {
    this.isVisible = true;
  }

  handleCancel(): void {
    console.log('Button cancel clicked!');
    this.isVisible = false;
  }
  handleCancelProblem():void{
this.visibleProblem=false;
  }
  handleOkProblem():void{
if (this.ProblemForm.invalid)
{
  alert('Please Check Error');
}
else{
  var object=this.ProblemForm.controls['object'].value;
  var descr=this.ProblemForm.controls['description'].value;
 
var problem={
"text": descr,
"object":object,
"usernameuser":this.user.username,
"version":this.Version,
"date":""


}

  this.api.saveproblem(problem)
  .subscribe({
    next:(res)=>{
      alert("Problem added successfully");
      this.ProblemForm.reset();
      this.visibleProblem=false;
 
    },
    error:()=>{
      alert("Error while adding the Problem")
    }
  })
}
  }
  deleteScripts(scripts: Scripts):void {
    if(confirm('Are you sure to delete Version'))
    this.api.deleteScripts(scripts).subscribe(
      res=>{ 
      this.getAllScripts();}
    );  
  
 window.location.reload(); 
  }

  handleOk(): void {
    console.log(this.LivraisonForm.value);
    this.api.AddScript(this.LivraisonForm.value)
    .subscribe({
      next:(res)=>{
        alert("Livraison added successfully");
        this.LivraisonForm.reset();
        this.isVisible=false;
this.getAllScripts();
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
  Logout()
  { 
    localStorage.removeItem('user');
    localStorage.clear();
    
    this.router.navigateByUrl('/login')
   
  }
 
}
