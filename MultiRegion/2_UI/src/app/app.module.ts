import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {CognitoLoginService, CognitoService} from './services/cognito.service';
import {TicketService} from './services/ticket.service';

import { FacebookModule } from 'ngx-facebook';
import {HttpModule} from '@angular/http';
import {FormsModule} from '@angular/forms';
import { LoginComponent } from './views/login/login.component';
import {AppRoutingModule} from './app-routing.module';
import {AuthGuard} from './shared/guard/auth.guard';
import {ConfigGuard} from './shared/guard/config.guard';
import {ToastaModule} from 'ngx-toasta';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { AmplifyAngularModule, AmplifyService } from 'aws-amplify-angular';

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
    ToastaModule.forRoot(),
    AmplifyAngularModule
  ],
  providers: [
    CognitoService,
    CognitoLoginService,
    TicketService,
    AuthGuard,
    ConfigGuard,
    AmplifyService
  ],
  exports: [BrowserModule, ToastaModule],
  bootstrap: [AppComponent]
})

export class AppModule { }
