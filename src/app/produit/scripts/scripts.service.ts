import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { da } from 'date-fns/locale';
import { Observable } from 'rxjs';
import { Scripts } from './scripts';
const httpOptions = { };
@Injectable({
  providedIn: 'root'
})
export class ScriptsService {
  private userUrl = 'http://localhost:8065'; 

  httpOptions =
  {
    headers: new HttpHeaders({
      'Content-Type': 'application/Json',
      
    })
  }
  constructor(private http : HttpClient) { }
  AddScript(data : any){
    return this.http.post<any>("http://localhost:8065/api/Livraison/addLivraisonfini",data );
  }
   getScripts():Observable<any>{
    return this.http.get<any>("http://localhost:8065/api/Livraison/Livraisonscript");
  }
  getScriptsc():Observable<any>{
    return this.http.get<any>("http://localhost:8065/api/Livraison/Livraison");
  }
  getScriptsB():Observable<any>{
    return this.http.get<any>("http://localhost:8065/api/Livraison/Livraisontest");
  }
  getScriptsH():Observable<any>{
    return this.http.get<any>("http://localhost:8065/api/Livraison/LivraisonH");
  }
  deleteScripts(scripts :Scripts):Observable<any>{
    const id = scripts.id;
    return this.http.delete<any>("http://localhost:8080/deleteScripts/"+id);
  } 


  updateUser(id: number, data:any):Observable<any>{
    return this.http.put<any>("http://localhost:8080/updateUser/",data)}
    
    updateLivrason(id: any,data:any):Observable<any>{
      return this.http.put<any>("http://localhost:8065/api/Livraison/updateLivraisonfini/"+id,data)}
    
    sendEmail( version:any):Observable<any>{ 
      return this.http.post<any>("http://localhost:8065/api/sendEmail",version);
    }
    updateLivrasonTest(id: any,data:any):Observable<any>{
      return this.http.put<any>("http://localhost:8065/api/Livraison/updateTest/"+id,data)}

      saveproblem(problem:any):Observable<any>{ 
      return this.http.post<any>("http://localhost:8065/api/user/addproblem",problem);
      }

      updateLivrasonLiv(id: any,data:any):Observable<any>{
        return this.http.put<any>("http://localhost:8065/api/Livraison/updateLivraison/"+id,data)}
  }

  


  
