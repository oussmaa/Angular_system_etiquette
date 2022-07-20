import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Livraison } from './livraison';
import { Observable } from 'rxjs';

const httpOptions = { };
@Injectable({
  providedIn: 'root'
})
export class LivraisonService {
  private userUrl = 'http://localhost:8080'; 
  constructor(private http: HttpClient) { }

    sendEmail() {
        return this.http.get(this.userUrl + '/sendEmail', httpOptions);
      }
      postUser(data : any){
        return this.http.post<any>("http://localhost:8080/addLivraison",data);
      }
       getScripts():Observable<any>{
        return this.http.get<any>("http://localhost:8080/Livraison");
      }
      deleteScripts(livraison :Livraison):Observable<any>{
        const id = livraison.id;
        return this.http.delete<any>("http://localhost:8080/deleteLivraison/"+id);
      } 
    updateUser(id: number, data:any):Observable<any>{
        return this.http.put<any>("http://localhost:8080/updateLivraison/",data)}
    
    }
    
