import { Component, OnInit } from '@angular/core';
import {CognitoLoginService, CognitoService, FacebookCallback} from '../../services/cognito.service';
import {Router} from '@angular/router';

declare var AWS: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, FacebookCallback {

  constructor(public router: Router,
              public cognitoLoginService: CognitoLoginService,
              public cognitoService: CognitoService) { }

  ngOnInit() {
  }

  loginWithFacebook() {
    this.cognitoLoginService.authenticateWithFacebook(this);
  }

  fbCallback(message: string, result: any) {

    console.log('LoginComponent: fbCallback --> result ' + JSON.stringify(result));

    if (message === null) {
      // this.toastr.success(message, 'Success!');
      console.log('sucess');
      this.router.navigate(['/ticket']);
    } else {
      // this.toastr.error(message, 'Error!');
      console.log('error');
    }
  }

  /**
   * Function just for testing api access
   */
  listInstances() {

    const ec2 = new AWS.EC2();
    ec2.describeInstances({}, function(err, data) {
      if (err) {
        console.log(err, err.stack);

      } else {

        const jsonPretty = JSON.stringify(data.Reservations, null, '\t');
        console.log(jsonPretty);
      }
    });

    const creds = AWS.config.credentials;

    console.log(creds);

  }
}
