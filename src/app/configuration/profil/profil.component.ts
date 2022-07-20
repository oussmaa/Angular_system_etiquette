import { Component, OnInit } from '@angular/core';
import { FormGroup , FormBuilder, Validators, FormControl} from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';

import { Notification } from './Notification';
import { StompService } from './stomp.service';
@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.css']
})
export class ProfilComponent implements OnInit {
  isCollapsed = false;
  public nbNotif:number=0 ;
  userForm !: FormGroup;
  displayedColumns: string[] = ['id' , 'firstName ', 'lastName', 'email','equipe', 'poste'];
  public notifications: Array<Notification> = [];
  public showNotification: boolean = false ;
   public hidden = false;
   public Id:number=0;
   registerForm!:FormGroup;
   name!:FormControl;
   lastname!:FormControl;
   email!:FormControl;
   password!:FormControl;
   confirmPassword!:FormControl;
   username!:FormControl;
   user:any;
   showNumerNotif:boolean=true;

   data:any;
   Name:any;
   Poste:any;
   Permission:any;
   imageSrc:any;
   file: File | null = null;
   nameAndLastnamePattern = "^[a-zA-Z_]{5,}$";
   emailPattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$";
 
  constructor( private formBuilder : FormBuilder , public router:Router, public stompService: StompService, private api:ApiService) { 
    this.registerForm = new FormGroup({
      name: new FormControl(),
      lastname: new FormControl(),
      email:new FormControl(),
      Equipe:new FormControl(),
      Post:new FormControl(),
 

  });
  this.user = JSON.parse(localStorage.getItem('user') || '{}'); 

  this.Permission=JSON.parse(localStorage.getItem('Permission') || '{}'); 

  this.registerForm = this.formBuilder.group({

    name: [this.user.firstName, [Validators.required,Validators.pattern(this.nameAndLastnamePattern) ]],
    lastname: [this.user.lastName, [Validators.required,Validators.pattern(this.nameAndLastnamePattern)] ],
    email:[this.user.email, [Validators.required,Validators.pattern(this.emailPattern)] ],
 
    Post:[this.user.poste, [Validators.required,Validators.pattern(this.nameAndLastnamePattern)] ],
    Equipe:[this.user.equipe, [Validators.required,Validators.pattern(this.nameAndLastnamePattern)] ],


 });
  }
  onFilechange(event: any) {
    console.log(event.target.files[0])
    this.file = event.target.files[0]
    const file = event.target.files[0];

    const reader = new FileReader();
    reader.onload = e => this.imageSrc = reader.result;

    reader.readAsDataURL(file);
  }

  upload() {
    if (this.file) {
      this.stompService.uploadfile(this.file,this.user.id).subscribe(
        res => {
          alert("Image Uploaded");
        //  this.router.navigateByUrl('/login')

        },
         err=>{
          alert(err.error.message)
        }
      );


    } else {
      alert("Please select a file first")
    }
  }
 
  submitForm(): void {
    if (this.registerForm.invalid){
      this.registerForm.markAllAsTouched();
    }else{
      let Equipe=this.registerForm.controls['Equipe'].value;
      let name= this.registerForm.controls['name'].value;
      let lastname= this.registerForm.controls['lastname'].value;
      let Post=this.registerForm.controls['Post'].value;
      let email=this.registerForm.controls['email'].value;

      this.data={
        "username":"username",
        "firstName":name,
        "lastName":lastname,
        "poste":Post,
        "equipe":Equipe,
        "email":email,
         "role":"User",
         "password":"ff",
         "imageUrl":""
        }
       
    
        this.api.updateUser(this.data,this.user.id).subscribe(
          data=> 
        {  localStorage.setItem('user',JSON.stringify(data))
   alert('Update successful')
    }   
  )}
}
    ngOnInit(): void {
      this.get5LastNotifications()
      this.getImage();
 
  }
  public openNotification(state: boolean) {
    
    this.showNotification=state;
    if(state==true)
    {
      this.showNumerNotif=false;
    }
    else{
      this.showNumerNotif=true;

    }
  }
  getImage()
  { 
    this.user = JSON.parse(localStorage.getItem('user') || '{}'); 
  this.imageSrc="http://localhost:8065/api/downloadFile/"+this.user.id;
  this.Name=this.user.username;
  this.Poste=this.user.poste;

  }  
  updateUser(){


 
    //window.location.reload();
}
  get5LastNotifications() {
    this.api.getNotif().subscribe(res => {
      this.notifications = res;
      this.nbNotif=this.notifications.length;
    });
  }
  Logout()
  { 
    localStorage.removeItem('user');
    localStorage.clear();
    
    this.router.navigateByUrl('/login')
   
  }
  }


