import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {CognitoLoginService, CognitoService, LoggedInCallback} from './services/cognito.service';
import {AWSService} from './services/aws.service';
import {environment} from '../environments/environment';
import {Router} from '@angular/router';
import {ToastsManager} from 'ng2-toastr';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, LoggedInCallback {

  constructor(public router: Router,
              public toastr: ToastsManager, vcr: ViewContainerRef,
              public awsService: AWSService,
              public cognitoService: CognitoService) {

    this.toastr.setRootViewContainerRef(vcr);

  }

  ngOnInit() {

    let errorMessages = [];

    console.log('AppComponent: Checking configuration values.');

    if(!environment.cognitoIdentityPoolId) {
      errorMessages.push("Cognito Identity Pool not configured!\n\t The id is available in cloud formation output section.\n");
    }

    if(!environment.facebookAppId) {
      errorMessages.push("Facebook App Id not configured! \n\t This is the ID from your facebook developer portal.\n");
    }

    if(!environment.ticketAPI) {
      errorMessages.push("Ticket API not configured!");
    }

    if(errorMessages.length > 0) {
      this.router.navigate(['/troubleshooting']);
    }



  }

  isLoggedIn(message: string, isLoggedIn: boolean) {

    console.log('AppComponent: the user is authenticated: ' + isLoggedIn);
  }

}
