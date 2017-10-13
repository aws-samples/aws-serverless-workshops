import {Component, OnInit} from '@angular/core';
import {CognitoLoginService, CognitoService, LoggedInCallback} from './services/cognito.service';
import {AWSService} from './services/aws.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, LoggedInCallback {

  constructor(public awsService: AWSService,
              public cognitoLoginService: CognitoLoginService,
              public cognitoService: CognitoService) {
  }

  ngOnInit() {
    console.log('AppComponent: Checking if the user is already authenticated');
  }

  isLoggedIn(message: string, isLoggedIn: boolean) {

    console.log('AppComponent: the user is authenticated: ' + isLoggedIn);
  }

}
