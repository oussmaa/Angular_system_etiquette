import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { tr } from 'date-fns/locale';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AutGardGuard implements CanActivate {
  user:any;
 x:any=true;
  constructor( private router: Router) {
    this.user = JSON.parse(localStorage.getItem('user') || '{}'); 



  }
 

  canActivate() {
    if (this.user.accessToken==undefined) {
      this.router.navigate(['/login']);
      return false;
    }  
 
    return true;
  }
}
