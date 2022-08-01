import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  usernamePattern="[a-zA-z1-9_]{5,}";
  passwordPattern=/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&_-]{8,}$/;
  data:any;
  user:any;

  submitForm(): void {

    if (this.loginForm.invalid){
      this.loginForm.markAllAsTouched();
    }else{
      let username=this.loginForm.controls['username'].value;
      let password=this.loginForm.controls['password'].value;

      this.user={
        "username":username,
         "password":password
        }
         this.servicre.signIn(this.user)
         .subscribe(
           res => {
            localStorage.setItem('user',JSON.stringify(res));
            if(res.valid==true)
            {

         
         if(res.roles=="User")
         {
          localStorage.setItem('Permission',JSON.stringify(true));

         }
       
         else{
          localStorage.setItem('Permission',JSON.stringify(false));

         }
         this.router.navigate(['/scripts'])
        }
        else{
          alert("User Not Have Permission")

        }
          
         
           },
            err=>{
              alert("Please Verif Your Password Or Username ")

           }
         );
    }
   }
   
   constructor(private fb: FormBuilder, private servicre:ApiService,private router:Router) {


 
    this.loginForm = new FormGroup({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
  });

  this.loginForm = this.fb.group({
    username: ['', [Validators.required,Validators.pattern(this.usernamePattern) ]],
    password: ['', [Validators.required,Validators.pattern(this.passwordPattern)] ],


  })


   }

  ngOnInit(): void {

 
 
  }

 

}
