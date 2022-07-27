import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { StompService } from 'src/app/notification/stomp.service';
import { Notification } from 'src/app/configuration/user/Notification';
import { User } from './user';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http'; 
import { th } from 'date-fns/locale';
import { popper } from '@popperjs/core';
@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  isVisible = false;
  isVisible2= false;
  isCollapsed = false;
  selectedValue = null;
  value?: string;
  user:any;
  Permission:any;
  registerForm!:FormGroup;
  firstName!:FormControl;
  lastname!:FormControl;
  email!:FormControl;
  password!:FormControl;
  confirmPassword!:FormControl;
  username!:FormControl;
  showNumerNotif:boolean=true;

   imageSrc:any;
  userForm !: FormGroup;
  usernamePattern="[a-zA-z1-9_]{5,}";
  nameAndLastnamePattern = "^[a-zA-Z_]{5,}$";
  emailPattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$";
  passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  displayedColumns: string[] = ['id' , 'firstName ', 'lastName', 'email','equipe', 'poste', 'Action','Permission','Photo'];
  dataSource!: MatTableDataSource<any>;
 
  public nbNotif:number=0 ;
  public notifications: Array<Notification> = [];
  public showNotification: boolean = false ;
   public hidden = false;
   public userList : User[]=[];
   public Id:number=0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private formBuilder : FormBuilder , 
              private api : ApiService,
              private router: Router, 
              private stompService: StompService,    
              private http:HttpClient ) {
                this.registerForm = new FormGroup({
                  firstName: new FormControl(),
                  lastname: new FormControl(),
                  email:new FormControl(),
                  password:new FormControl(),
                  username:new FormControl(),
                  Post:new FormControl(),
                  Equipe:new FormControl(),
                  roles:new FormControl()
            
              });
              this.registerForm = this.formBuilder.group({
            
                firstName: ['', [Validators.required,Validators.pattern(this.nameAndLastnamePattern) ]],
                lastname: ['', [Validators.required,Validators.pattern(this.nameAndLastnamePattern)] ],
                email:['', [Validators.required,Validators.pattern(this.emailPattern)] ],
                password:['', [Validators.required,Validators.pattern(this.passwordPattern)] ],
                username:['', [Validators.required,Validators.pattern(this.usernamePattern)] ],
                Post:['', [Validators.required]],
                Equipe:['', [Validators.required ]],
                roles:['', [Validators.required] ],

             });
              }
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

              changeEtat(event:any,row:any)
              {
                console.log(event)
                console.log(row)
                this.api.updateUser(row.valid,row.id).subscribe(data=> console.log('data',data))

              }


              submitForm(): void {
                if (this.registerForm.invalid){
                  this.registerForm.markAllAsTouched();
                }else{
                  let username=this.registerForm.controls['username'].value;
                  let firstName= this.registerForm.controls['firstName'].value;
                  let lastname= this.registerForm.controls['lastname'].value;
                  let password=this.registerForm.controls['password'].value;
                  let email=this.registerForm.controls['email'].value;
                  let Post=this.registerForm.controls['Post'].value;
                  let roles=this.registerForm.controls['roles'].value;

                  let Equipe=this.registerForm.controls['Equipe'].value;

             this.user={
                  "username":username,
                  "firstName":firstName,
                  "lastName":lastname,
                  "poste":Post,
                  "equipe":Equipe,
                  "email":email,
                   "role":roles,
                   "password":password,
                   "imageUrl":"",
                   "valid":false
                  }
                  console.log(this.user)
                   this.api.postUser(this.user)
                   .subscribe(
                     res => {
                      console.log(res)
                       alert("Add successfully");
                      this.getAllUser();
                       this.isVisible=false; 
              
                     },
                      err=>{
                       alert(err.error.message)
                     }
                   );
            
            
                }
              }
  showModal(): void {
    this.isVisible = true;
  }

  showModal2(row:any): void {
    this.isVisible2 = true;
    this.Id= row.id;
  }


  handleCancel(): void {
    console.log('Button cancel clicked!');
    this.isVisible = false;
  }
  get5LastNotifications() {
    this.api.getNotif().subscribe(res => {
      this.notifications = res;
      this.nbNotif=this.notifications.length;
    });
  }
  ngOnInit(): void {
    this.Permission=JSON.parse(localStorage.getItem('Permission') || '{}'); 

    this.get5LastNotifications();
    this.getImage();
 
    this.getAllUser();

    this.userForm = this.formBuilder.group({
      id : ['',Validators.required],
      firstName  : ['',Validators.required],
      lastName: ['',Validators.required],
      email : ['',Validators.required],
      equipe : ['',Validators.required],
      poste : ['',Validators.required],
    })
}
public openNotification(state: boolean) {
  //this.get5LastNotifications();
  this.showNotification = state;
  if(state==true)
  {
    this.showNumerNotif=false;
  }
  else{
    this.showNumerNotif=true;

  }
}

  getAllUser(){
    this.api.getUser()
    .subscribe((res)=>{
    this.dataSource = new MatTableDataSource(res);
    this.dataSource.paginator = this.paginator;
    this.userList = res;
    console.log('res', this.userList)
    this.dataSource.sort = this.sort
    })
  } 

  deleteUser(user: User):void {

    if(this.Permission==true)
    {
alert("Don't Have Permission ")
    }
    else{

    
    console.log('user',user)
    if(confirm('Are you sure to delete user'))
    this.api.deleteUser(user).subscribe(
      res=>{ 
      this.getAllUser();
    }
    );  
   
  }
  }

  updateUser(){
    console.log(this.Id)
    this.userForm.get('id')?.setValue(this.Id)
    this.api.updateUser(this.userForm.value,this.Id).subscribe(data=> console.log('data',data))
    this.isVisible2=false;
   this.getAllUser();
}


  handleOk(): void {
    console.log(this.userForm.value)
 
       this.api.postUser(this.user)
      .subscribe({
        next:(res)=>{
          alert("User added successfully");
          this.userForm.reset();
  
        },
        error:()=>{
          alert("Error while adding the user")
        }
      }) 
     
  }
 
  applyFilter ( event: Event ) {
    const filterValue = (event.target as HTMLInputElement).value;
   this .dataSource.filter = filterValue.trim().toLowerCase();

   if ( this .dataSource.paginator) {
      this .dataSource.paginator.firstPage();
   }
 

 
}
 
}
 