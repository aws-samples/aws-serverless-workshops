import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {AWSService} from './services/aws.service';
import {CognitoLoginService, CognitoService} from './services/cognito.service';
import {TicketService} from './services/ticket.service';

import { FacebookModule } from 'ngx-facebook';
import {HttpModule} from '@angular/http';
import {FormsModule} from '@angular/forms';
import { LoginComponent } from './views/login/login.component';
import {AppRoutingModule} from './app-routing.module';
import {AuthGuard} from './shared/guard/auth.guard';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    FacebookModule.forRoot(),
    AppRoutingModule
  ],
  providers: [
    AWSService,
    CognitoService,
    CognitoLoginService,
    TicketService,
    AuthGuard
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }
