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
    this.initializeWebSocketConnection();
  }
  // Store the chat messages
  public notifications = [];
  public stompClient:any;
  public counterChange = new Subject<number>();
  public nbNotif = this.counterChange.asObservable();
  public nbNotifs = 0;
  readonly notificationUrl = 'http://localhost:8080/';
  initializeWebSocketConnection() {
    /**
     * Create a SockJS server with created back-end endpoint called /chat-websocket and added it over Stomp.
     */
    const serverUrl = 'http://localhost:8080/sendmsg';

    const ws = new SockJS(serverUrl);
    this.stompClient = Stomp.over(ws);
    const that = this;
    /**
     * Connect stomp client and subscribe asynchronously to the chat message-handling Controller endpoint and push any message body into the messages array
     */
    // tslint:disable-next-line:only-arrow-functions
    this.stompClient.connect({}, function(frame:any) {
      that.stompClient.subscribe('/queue/reply', (notif:any) => {
         that.increment();
      });
    });
  }

  // Prepare and push the chat messages into the messages array
  getLastNotification(): Observable<Array<Notification>>{
    return this.http.get<Array<Notification>>(`${this.notificationUrl + 'LastNotifications'}`);
  }
  increment(){
    this.counterChange.next(++this.nbNotifs);
  }

  initialize(){
    this.counterChange.next(this.nbNotifs = 0);
  }

  // Send a chat message using stomp client
  sendMessage(notif: Notification) {
     this.stompClient.send('/ws/sendmsges', {}, notif);

  }
}