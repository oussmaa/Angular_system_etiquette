import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../configuration/user/user';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http : HttpClient) { }
  httpOptions =
  {
    headers: new HttpHeaders({
      'Content-Type': 'application/Json',
      
    })
  }
  postUser(data : any){
    return this.http.post<any>("http://localhost:8065/api/auth/signup",
 data
 );
 
  }
  signIn(data : any){
    return this.http.post<any>("http://localhost:8065/api/auth/signin",
 data
 );}
   getUser():Observable<any>{
    return this.http.get<any>("http://localhost:8065/api/user/users");
  }

  getNotif():Observable<any>{
    return this.http.get<any>("http://localhost:8065/api/LastNotifications");
  }

  getProblem():Observable<any>{
    return this.http.get<any>("http://localhost:8065/api/user/GetAllProblem");
  }

  getUserAndAdmin():Observable<any>{
    return this.http.get<any>("http://localhost:8065/api/user/GetUserAndAdmin");
  }

  getEventByUsername(username:any):Observable<any>{
    return this.http.get<any>("http://localhost:8065/api/event/findEventByusername/"+username);
  }
  getetatlivraison():Observable<any>{
    return this.http.get<any>("http://localhost:8065/api/event/GetAllTiketTerminer/");
  }
  
  deleteUser(user: User):Observable<any>{
    const id = user.id;
    return this.http.delete<any>("http://localhost:8065/api/event/deleteUser/"+id);
  } 
updateUser(user:any, id:any):Observable<any>{
    return this.http.put<any>("http://localhost:8065/api/user/updateUser/"+id,user)}

}
