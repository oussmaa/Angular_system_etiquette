import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzFormTooltipIcon } from 'ng-zorro-antd/form';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm!:FormGroup;
  name!:FormControl;
  lastname!:FormControl;
  email!:FormControl;
  
  password!:FormControl;
  confirmPassword!:FormControl;
  username!:FormControl;
  user:any;
  usernamePattern="[a-zA-z1-9_]{5,}";
  nameAndLastnamePattern = "^[a-zA-Z_]{5,}$";
  emailPattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$";
  passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;


  submitForm(): void {
    if (this.registerForm.invalid){
      this.registerForm.markAllAsTouched();
    }else{
      let username=this.registerForm.controls['username'].value;
      let name= this.registerForm.controls['name'].value;
      let lastname= this.registerForm.controls['lastname'].value;
      let password=this.registerForm.controls['password'].value;
      let email=this.registerForm.controls['email'].value;
      let confirmPassword=this.registerForm.controls['confirmPassword'].value;
      let Post=this.registerForm.controls['Post'].value;
 
      let Equipe=this.registerForm.controls['Equipe'].value;
this.user={
      "username":username,
      "firstName":name,
      "lastName":lastname,
      "poste":Post,
      "equipe":Equipe,
      "email":email,
      "role":"User",
       "password":password,
       "imageUrl":"",
       "valid":false
      }
       this.service.postUser(this.user)
       .subscribe(
         res => {
           alert("Register successfully");
           this.router.navigateByUrl('/login')
 
         },
          err=>{
           alert(err.error.message)
         }
       );


    }
  }

  constructor(private fb: FormBuilder,private service:ApiService,private router:Router) {

    this.registerForm = new FormGroup({
      name: new FormControl(),
      lastname: new FormControl(),
      email:new FormControl(),
      password:new FormControl(),
      confirmPassword:new FormControl(),
      username:new FormControl(),
      Post:new FormControl(),
      Equipe:new FormControl(),

  });
  this.registerForm = this.fb.group({

    name: ['', [Validators.required,Validators.pattern(this.nameAndLastnamePattern) ]],
    lastname: ['', [Validators.required,Validators.pattern(this.nameAndLastnamePattern)] ],
    email:['', [Validators.required,Validators.pattern(this.emailPattern)] ],
    password:['', [Validators.required,Validators.pattern(this.passwordPattern)] ],
    confirmPassword:['', [Validators.required,Validators.pattern(this.passwordPattern)] ],
    username:['', [Validators.required,Validators.pattern(this.usernamePattern)] ],
    Post:['', [Validators.required]],
    Equipe:['', [Validators.required ]],


 });
  }

  ngOnInit(): void {
this.registerForm.reset();
  }

}
