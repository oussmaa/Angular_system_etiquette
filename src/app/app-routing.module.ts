
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CalendarComponent } from './calendar/calendar.component';
import { ProfilComponent } from './configuration/profil/profil.component';
import { UserComponent } from './configuration/user/user.component';
  
import { LivraisonComponent } from './produit/livraison/livraison.component';
import { ProduitComponent } from './produit/produit.component';
import { ScriptsComponent } from './produit/scripts/scripts.component';
import { RegisterComponent } from './register/register.component';
import { NotificationComponent } from './notification/notification.component';
import { TestComponent } from './produit/test/test.component';
import { AutGardGuard } from './Shared/aut-gard.guard';
import { HistoriqueComponent } from './historique/historique.component';
import { ProblemComponent } from './problem/problem.component';
import { LoginComponent } from './login/login.component';


const routes: Routes = [
  {path:'',pathMatch:'full',redirectTo:'/login'},
  {path:'login',component:LoginComponent } ,
  {path:'register',component:RegisterComponent },
  {path:'calendar',component:CalendarComponent ,canActivate: [AutGardGuard]},
  {path:'user',component:UserComponent ,canActivate: [AutGardGuard] },
  {path:'history',component:HistoriqueComponent ,canActivate: [AutGardGuard] },
  {path:'profil',component:ProfilComponent,canActivate: [AutGardGuard] },
  {path:'scripts',component:ScriptsComponent,canActivate: [AutGardGuard] },
  {path:'produit',component:ProduitComponent ,canActivate: [AutGardGuard]},
   {path:'livraison',component:LivraisonComponent,canActivate: [AutGardGuard]},
  {path:'notif',component:NotificationComponent },
 {path:'test',component:TestComponent },
 {path:'Problem',component:ProblemComponent,canActivate: [AutGardGuard]},
 
  //{ path: '', pathMatch: 'full', redirectTo: '/welcome' },
  //{ path: 'welcome', loadChildren: () => import('./pages/welcome/welcome.module').then(m => m.WelcomeModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
