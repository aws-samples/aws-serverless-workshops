import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {ViewsComponent} from './views.component';
import {TicketComponent} from './ticket/ticket.component';
import {CognitoToolsComponent} from './cognito-tools/cognito-tools.component';
import {HomeComponent} from './home/home.component';
import {AuthGuard} from '../shared/guard/auth.guard';
import {TroubleshootingComponent} from './troubleshooting/troubleshooting.component';
import {ConfigGuard} from '../shared/guard/config.guard';

const viewsRoutes: Routes = [
  {
    path: '', component: ViewsComponent,
    children: [
      {
        path: 'home', component: HomeComponent
      },
      {
        path: 'ticket', component: TicketComponent, canActivate: [ConfigGuard, AuthGuard]
      },
      {
        path: 'cognito', component: CognitoToolsComponent
      },
      {
        path: 'troubleshooting', component: TroubleshootingComponent
      }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(viewsRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class ViewsRoutingModule { }
