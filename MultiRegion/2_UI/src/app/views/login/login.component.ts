import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {
  CognitoLoginService, CognitoService,
  FacebookCallback
} from '../../services/cognito.service';
import {Router} from '@angular/router';
import {ToastsManager} from 'ng2-toastr';

declare var AWS: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, FacebookCallback {


  constructor(private toastr: ToastsManager, vRef: ViewContainerRef,
              public router: Router,
              public cognitoLoginService: CognitoLoginService) {

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


}
