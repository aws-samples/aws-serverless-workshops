import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Router } from '@angular/router';
import {CognitoService} from '../../services/cognito.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private router: Router) { }

  canActivate() {

    if (CognitoService.isLoggedin()) {
      return true;
    }

    this.router.navigate(['/login']);

    return false;
  }
}
