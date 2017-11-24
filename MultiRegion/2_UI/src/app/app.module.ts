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
import {ConfigGuard} from './shared/guard/config.guard';
import {ToastModule} from 'ng2-toastr';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

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
    AppRoutingModule,
    BrowserAnimationsModule,
    ToastModule.forRoot()
  ],
  providers: [
    AWSService,
    CognitoService,
    CognitoLoginService,
    TicketService,
    AuthGuard,
    ConfigGuard
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }
