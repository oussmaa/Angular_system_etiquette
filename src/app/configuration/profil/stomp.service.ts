import {Injectable, Input, Output, EventEmitter} from '@angular/core';
import * as SockJS from 'sockjs-client';
import * as Stomp from 'stompjs';

import {Observable, Subject} from 'rxjs';
import {HttpClient} from '@angular/common/http';


@Injectable({
  providedIn: 'root',
})
export class StompService {

  constructor(public http: HttpClient) {
 
}
public uploadfile(file: File,id:any) {
  let formParams = new FormData();
  formParams.append('file', file)
  return this.http.post('http://localhost:8065/api/uploadFile/'+ id, formParams)
}

getImages(id:any):Observable<any>{

  return this.http.get<any>('http://localhost:8065/api/downloadFile/'+id);
}

} 