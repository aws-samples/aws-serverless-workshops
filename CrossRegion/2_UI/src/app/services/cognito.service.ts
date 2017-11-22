import {Injectable, Inject} from '@angular/core';
import {FacebookService, InitParams, LoginOptions, LoginResponse} from 'ngx-facebook';
import {environment} from '../../environments/environment';
import {Router} from '@angular/router';

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
    public currentEmailID = '';

    public static getAwsCognito(): any {
        return AWSCognito;
    }

    getCognitoIdentity(): string {
        return AWS.config.credentials.identityId;
    }

  public static isLoggedin(){

    return AWS.config.credentials;

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

                // Add the Facebook access token to the Cognito credentials login map.
                AWS.config.credentials = new AWS.CognitoIdentityCredentials({
                    IdentityPoolId: CognitoService._IDENTITY_POOL_ID,
                    Logins: {
                        'graph.facebook.com': response.authResponse.accessToken
                    }
                });

                this.fb.api('/me', 'get', {fields: 'name, email'})
                    .then(res => {
                        console.log(res);
                        that.cognitoService.currentEmailID = res.email;
                    })
                    .catch(e => {
                        console.log(e);
                    });

                AWS.config.credentials.get(function (err) {
                    if (!err) {
                      callback.fbCallback(null, response);
                      localStorage.setItem('isLoggedin', 'true');
                    } else {
                        //If cognito id pool incorrect we get error here
                        callback.fbCallback(err.message, null);
                    }
                });


            })
            .catch((error: any) => {
                console.error(error);
                callback.fbCallback(error, null);
            });
    }

    logout() {

        console.log('CognitoLoginService: Logging out');

        this.cognitoService.currentEmailID = '';

        // AWS.config.credentials.clearCachedId();
        AWS.config.credentials = null;
    }

}
