import {NgModule} from '@angular/core';
import {ViewsComponent} from './views.component';
import {ViewsRoutingModule} from './views-routing.module';
import {TicketComponent} from './ticket/ticket.component';
import {CognitoToolsComponent} from './cognito-tools/cognito-tools.component';
import { HomeComponent } from './home/home.component';
import {TicketListComponent} from '../components/ticket-list/ticket-list.component';
import {FormsModule} from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { TroubleshootingComponent } from './troubleshooting/troubleshooting.component';
import {CommonModule} from '@angular/common';
import {ToastaModule} from 'ngx-toasta';

@NgModule({
  imports: [
    ViewsRoutingModule,
    FormsModule,
    NgxDatatableModule,
    CommonModule,
    ToastaModule.forRoot()
  ],
  declarations: [
    ViewsComponent,
    TicketComponent,
    HomeComponent,
    CognitoToolsComponent,
    HomeComponent,
    TicketListComponent,
    TroubleshootingComponent
  ]
})
export class ViewsModule { }
