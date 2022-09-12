import {
  Component, ChangeDetectionStrategy,ViewChild, TemplateRef, OnInit} from '@angular/core';
import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours,
} from 'date-fns';
import { Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarView,
} from 'angular-calendar';
import { Notification } from './Notification';
import { StompService } from './stomp.service';
import { CalendarService } from './calendar.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { NzSelectSizeType } from 'ng-zorro-antd/select';
import { User } from '../configuration/user/user';
const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3',
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF',
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA',
  },
};
@Component({
  selector: 'app-calendar',  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {
  isCollapsed = false;
  imageSrc:any;
  public nbNotif:number=0 ;
  public notifications: Array<Notification> = [];
  public showNotification: boolean = false ;
   public hidden = false;
   Permission:any;
   eventForm!: FormGroup;
   eventName!:FormControl;
   selectedValue:any=null;
   DateCompare:Date=new Date();
   eventend!:FormControl;
   showNumerNotif:boolean=true;
   public userList : User[]=[];
   eventPattern = "[a-zA-z]*$";
   NewDateEvent:any;
  isVisible = false;
  @ViewChild('modalContent', { static: true }) modalContent!: TemplateRef<any>;

  view: CalendarView = CalendarView.Month;

  CalendarView = CalendarView;

  viewDate: Date = new Date();

  modalData!: {
    action: string;
    event: CalendarEvent;
  };
  listOfOption: Array<{ label: string; value: string }> = [];
  size: NzSelectSizeType = 'default';
  singleValue = 'a10';
  multipleValue = ['a10', 'c12'];
  tagValue = ['a10', 'c12', 'tag'];
  actions: CalendarEventAction[] = [
    {
      label: '<i class="fas fa-fw fa-pencil-alt"></i>',
      a11yLabel: 'Edit',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Edited', event);
      },
    },
    {
      label: '<i class="fas fa-fw fa-trash-alt"></i>',
      a11yLabel: 'Delete',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.events = this.events.filter((iEvent) => iEvent !== event);
        this.handleEvent('Deleted', event);
      },
    },
  ];

  refresh = new Subject<void>();

  events: CalendarEvent[] = []
  NewEvent: any;
  AllEvent: any;
  user: any;
  activeDayIsOpen: boolean = true;

  constructor(private modal: NgbModal,private router:Router,public api:ApiService, private fb: FormBuilder, private stompService: StompService, private services:CalendarService,private toast:ToastrService) {
    this.eventForm = new FormGroup({
      eventName :new FormControl(),
      eventend  :new FormControl(),
      username  :new FormControl(),
      dateDebutScript  :new FormControl(),
      datefinScript  :new FormControl(),
    });
    this.eventForm = this.fb.group({
      eventName: ['', [Validators.required,Validators.maxLength(8)]],
      eventend: ['', [Validators.required ]],
      username: ['', [Validators.required ]],
      dateDebutScript: ['', [Validators.required ]],
      datefinScript: ['', [Validators.required ]],
    })
  }
 
   
 
 
 
 
  AddNewEvent():void {
    if(this.Permission==true)
    {
    alert("Don't Have Permission");

    }
    else{
    if (this.eventForm.invalid){
      this.eventForm.markAllAsTouched();
    }else{
      let ev=this.eventForm.controls['eventName'].value;
      let evend=this.eventForm.controls['eventend'].value;
      let usern=this.eventForm.controls['username'].value;
      let dateDebutScript=this.eventForm.controls['dateDebutScript'].value;
      let datefinScript=this.eventForm.controls['datefinScript'].value;

    this.NewEvent ={
      dateDebutScript:dateDebutScript,
      datefinScript:datefinScript,
      title: ev,
      start: startOfDay(this.NewDateEvent),
      end: endOfDay(evend),
      color:'#FF0000',
      username:usern,
      Genrate:new Date()
    }
    this.services.postEvent(this.NewEvent)
      .subscribe({
        next:(res)=>{
     alert("Event added successfully");
    

  this.modal.dismissAll();
        },
        error:()=>{
          alert("Error while adding the Livraison")
        }
        
      });

      this.events = [
        ...this.events,
        {
          title: ev,
          start: startOfDay(this.NewDateEvent),
          end: endOfDay(evend),
          color: colors.blue,
          draggable: false,
        },
      ];
      window.location.reload();
      this.modal.dismissAll();
    }
  }
  }
  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] },): void {
   
    this.DateCompare.setHours(0,0,0);
 
    if(date > this.DateCompare || date.toString() == this.DateCompare.toString())
    {
      this.modal.open(this.modalContent,{ size: 'lg' });
      this.NewDateEvent=date;

      if (isSameMonth(date, this.viewDate)) {
     if (
       (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
       events.length === 0
     ) {
       this.activeDayIsOpen = false;
     } else {
       this.activeDayIsOpen = true;
     }
     this.viewDate = date;
   }
    }
    else{
      alert("Please selected Other Date")
    }

  }

  eventTimesChanged({
    event,
    newStart,
    newEnd,
  }: CalendarEventTimesChangedEvent): void {
    this.events = this.events.map((iEvent) => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd,
        };
      }
      return iEvent;
    });
    this.handleEvent('Dropped or resized', event);
  }

  handleEvent(action: string, event: CalendarEvent): void {
    this.modalData = { event, action };
     this.modal.open(this.modalContent, { size: 'lg' });
  }
  getImage()
  {
    this.user = JSON.parse(localStorage.getItem('user') || '{}'); 
  this.imageSrc="http://localhost:8065/api/downloadFile/"+this.user.id;
  

  } 
  Logout()
  { 
    localStorage.removeItem('user');
    localStorage.clear();
    
    this.router.navigateByUrl('/login')
   
  }
  addEvent(): void {
    this.events = [
      ...this.events,
      {
        title: 'New event',
        start: startOfDay(new Date()),
        end: endOfDay(new Date()),
        color: colors.green,
        draggable: true,
 
      },
    ];
   
  }

  deleteEvent(eventToDelete: CalendarEvent) {
    this.events = this.events.filter((event) => event !== eventToDelete);
   
    this.services.deleteEvent(eventToDelete.id).subscribe( {
      next:(res)=>{
        alert("Event delted successfully");
        window.location.reload();


    
           },
           error:()=>{
             alert("Error while delet the event")
           }

    });

  }

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }
  get5LastNotifications() {
    this.api.getNotif().subscribe(res => {
      this.notifications = res;
      this.nbNotif=this.notifications.length;
    });
  }
  getAllUser(){
    this.api.getUser()
    .subscribe((res)=>{
      this.userList=res;
    })
  } 
  ngOnInit(): void {
    this.Permission=JSON.parse(localStorage.getItem('Permission') || '{}'); 
this.getAllUser();
    this.get5LastNotifications();
    this.getImage();
    this.getAllEvent();
    this.user = JSON.parse(localStorage.getItem('user') || '{}'); 
   



 
 
  }


  public openNotification(state: boolean) {
  
    this.showNotification = state;
    if(state==true)
    {
      this.showNumerNotif=false;
    }
    else{
      this.showNumerNotif=true;

    }
  }
  
  getAllEvent() {
    this.services.getAllEvent().subscribe(event => {
 
      let ev:any;

      for(ev of event)
      {
        this.AllEvent={
          
            title: ev.title,
            start: startOfDay(new Date(ev.start)),
            end: endOfDay(new Date (ev.end)),
            color: colors.blue,
            draggable: false,
            id:ev.id
          
        }
       
        this.events.push(this.AllEvent);
      }

      this.viewDate = new Date();

    });
   
  }
}
