import {Injectable, Inject} from '@angular/core';
import {FacebookService, InitParams, LoginOptions, LoginResponse} from 'ngx-facebook';
import {environment} from '../../environments/environment';
import {Router} from '@angular/router';
import {Auth} from 'aws-amplify';

declare var AWSCognito: any;
declare var AWS: any;

export interface CognitoCallback {
  cognitoCallback(message: string, result: any): void;
}

export interface FacebookCallback {
  fbCallback(message: string, result: any): void;
}

export interface LoggedInCallback {
  isLoggedIn(message: string, loggedIn: boolean): void;
}

export interface Callback {
  callback(): void;

  callbackWithParam(result: any): void;
}

@Injectable()
export class CognitoService {

  public static _REGION = environment.region;

  public static _IDENTITY_POOL_ID = environment.cognitoIdentityPoolId;

  /**
   * When authenticating w/ user pool or face book we set currentEmailID
   * This ID is used in API requests.
   * @type {string}
   */
  public currentEmailID = null;

  public isLoggedin() {

    return this.currentEmailID;

  }
}

@Injectable()
export class CognitoLoginService {

  public static _FACEBOOK_APP_ID = environment.facebookAppId;

  constructor(public router: Router,
              public cognitoService: CognitoService,
              private fb: FacebookService) {

    const initParams: InitParams = {
      appId: CognitoLoginService._FACEBOOK_APP_ID,
      xfbml: true,
      version: 'v2.8'
    };

    fb.init(initParams);
  }

  /**
   * http://docs.aws.amazon.com/cognito/latest/developerguide/facebook.html
   * @param {FacebookCallback} callback
   */
  authenticateWithFacebook(callback: FacebookCallback) {

    // login with options
    const options: LoginOptions = {
      scope: 'email',
      return_scopes: true,
      enable_profile_selector: true
    };

    const that = this;

    this.fb.login(options)
      .then((response: LoginResponse) => {

        console.log('fb.login on fulfilled res => ' + JSON.stringify(response, null, 2));

        this.fb.api('/me', 'get', {fields: 'name, email'})
          .then(res => {
            console.log('fb.api on fulfilled res => ' + JSON.stringify(res, null, 2));
            that.cognitoService.currentEmailID = res.email;
          })
          .catch(e => {
            console.log('fb.api on rejected res => ' + e);
          });

        callback.fbCallback(null, response);

      })
      .catch((error: any) => {
        console.error('fb.login on REJECTED  => ' + JSON.stringify(error, null, 2));
        callback.fbCallback(error, null);
      });
  }

  logout() {
    console.log('CognitoLoginService: Logging out');

    this.cognitoService.currentEmailID = '';

    Auth.signOut()
      .then(data => console.log('Fulfilled: ' + data))
      .catch(err => console.log(err));
  }

}
