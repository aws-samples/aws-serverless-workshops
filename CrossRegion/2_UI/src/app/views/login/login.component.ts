import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {
  AmazonLoginCallback, CognitoLoginService, CognitoService,
  FacebookCallback
} from '../../services/cognito.service';
import {Router} from '@angular/router';
import {ToastsManager} from 'ng2-toastr';
import {AmazonAuthResponse} from '../../components/amazon-login/amazon-login.component';
import {environment} from '../../../environments/environment';

declare var AWS: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, FacebookCallback, AmazonLoginCallback {

  /**
   * used in view.
   * @type {string}
   */
  private myClientId: string = environment.amazonLoginId;

  constructor(private toastr: ToastsManager, vRef: ViewContainerRef,
              public router: Router,
              public cognitoLoginService: CognitoLoginService,
              public cognitoService: CognitoService) {

    this.toastr.setRootViewContainerRef(vRef);

  }

  ngOnInit() {
  }

  loginWithFacebook() {
    this.cognitoLoginService.authenticateWithFacebook(this);
  }

  fbCallback(message: string, result: any) {

    console.log('LoginComponent: fbCallback --> result ' + JSON.stringify(result));

    if (message === null) {
      this.router.navigate(['/ticket']);

    } else {
      this.toastr.error(message, 'Error!');
    }
  }

  onAmazonAuthResponse(amazonAuthResponse: AmazonAuthResponse) {
    this.cognitoLoginService.authenticateWithAmazon(amazonAuthResponse, this);

  }

  amazonLoginCallback(message: string, result: any) {

    console.log('LoginComponent: amazonLoginCallback --> result ' + JSON.stringify(result));

    if (message === null) {
      this.router.navigate(['/ticket']);

    } else {
      this.toastr.error(message, 'Error!');
    }
  }

}
