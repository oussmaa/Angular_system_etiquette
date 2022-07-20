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
  // Store the chat messages
  public notifications = [];
  public stompClient:any;
  public counterChange = new Subject<number>();
  public nbNotif = this.counterChange.asObservable();
  public nbNotifs = 0;
  readonly notificationUrl = 'http://localhost:8080/';
 
 
  getAllUser():Observable<any>{
    return this.http.get<any>("http://localhost:8065/api/event/GetAllEvent");
  }
}