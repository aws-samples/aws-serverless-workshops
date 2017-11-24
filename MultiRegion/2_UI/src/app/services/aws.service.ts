import { Injectable } from '@angular/core';
import {Callback, CognitoService} from './cognito.service';

declare const AWS: any;
// declare const AMA: any;

@Injectable()
export class AWSService {

    public static firstLogin = false;
    public static runningInit = false;

    constructor() {
        AWS.config.update({region: CognitoService._REGION});
    }

    /**
     * This is the method that needs to be called in order to init the aws global creds
     */
    initAWSService(callback: Callback, isLoggedIn: boolean, idToken: string) {

        if (AWSService.runningInit) {
            // Need to make sure I don't get into an infinite loop here, so need to exit if this method is running already
            console.log('AWSService: Aborting running initAWSService()...it\'s running already.');

            // instead of aborting here, it's best to put a timer
            if (callback != null) {
                callback.callback();
                callback.callbackWithParam(null);
            }
            return;
        }

        console.log('AWSService: Running initAWSService()');

        AWSService.runningInit = true;

        const myThis = this;

        // First check if the user is authenticated already
        if (isLoggedIn) {
            myThis.setupAWS(isLoggedIn, callback, idToken);
        }

    }



    /**
     * Sets up the AWS global params
     *
     * @param isLoggedIn
     * @param callback
     * @param idToken
     */
    setupAWS(isLoggedIn: boolean, callback: Callback, idToken: string): void {

        console.log('AWSService: in setupAWS()');

        if (isLoggedIn) {

            console.log('AWSService: User is logged in');
            // Setup mobile analytics

            const options = {
                appId: '32673c035a0b40e99d6e1f327be0cb60',
                appTitle: 'aws-cognito-angular2-quickstart'
            };

            console.log('AWSService: Retrieving the id token');

        } else {
            console.log('AWSService: User is not logged in');
        }

        if (callback != null) {
            callback.callback();
            callback.callbackWithParam(null);
        }

        AWSService.runningInit = false;
    }

    // addCognitoCredentials(idTokenJwt: string): void {
    //
    //     const params = AWSService.getCognitoParametersForIdConsolidation(idTokenJwt);
    //
    //     AWS.config.credentials = new AWS.CognitoIdentityCredentials(params);
    //
    //     AWS.config.credentials.get(function (err) {
    //         if (!err) {
    //             // const id = AWS.config.credentials.identityId;
    //             if (AWSService.firstLogin) {
    //                 // save the login info to DDB
    //                 this.ddb.writeLogEntry('login');
    //                 AWSService.firstLogin = false;
    //             }
    //         }
    //     });
    // }

    // static getCognitoParametersForIdConsolidation(idTokenJwt: string): {} {
    //     console.log('AWSService: enter getCognitoParametersForIdConsolidation()');
    //     const url = 'cognito-idp.' + CognitoService._REGION.toLowerCase() + '.amazonaws.com/' + CognitoService._USER_POOL_ID;
    //     const logins: Array<string> = [];
    //     logins[url] = idTokenJwt;
    //     const params = {
    //         IdentityPoolId: CognitoService._IDENTITY_POOL_ID, /* required */
    //         Logins: logins
    //     };
    //
    //     return params;
    //
    // }

}
