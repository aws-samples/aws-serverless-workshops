import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Router } from '@angular/router';
import {environment} from '../../../environments/environment';

@Injectable()
export class ConfigGuard implements CanActivate {

  constructor(private router: Router) { }

  canActivate() {

    const errorMessages = [];

    if (!environment.cognitoIdentityPoolId) {
      errorMessages.push('Cognito Identity Pool not configured!\n\t The id is available in cloud formation output section.\n');
    }

    if (!environment.facebookAppId) {
      errorMessages.push('Facebook App Id not configured! \n\t This is the ID from your facebook developer portal.\n');
    }

    if (!environment.ticketAPI) {
      errorMessages.push('Ticket API not configured!');
    }

    if (environment.ticketAPI && !(environment.ticketAPI.slice(-1) === '/')) {
      errorMessages.push('Ticket API URL needs a trailing slash!');
    }

    if (errorMessages.length > 0) {
      this.router.navigate(['/troubleshooting']);
      return false;
    }

    return true;
  }
}
