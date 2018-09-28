import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {
  CognitoLoginService, CognitoService,
  FacebookCallback
} from '../../services/cognito.service';
import {Router} from '@angular/router';
import {ToastaService, ToastaConfig, ToastOptions, ToastData} from 'ngx-toasta';
import { AmplifyService } from 'aws-amplify-angular';

declare var AWS: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, FacebookCallback {


  constructor(private toastaService: ToastaService, private toastaConfig: ToastaConfig,
              public router: Router,
              public cognitoLoginService: CognitoLoginService,
              private amplifyService: AmplifyService) {

    this.toastaConfig.theme = 'default';

  }

  ngOnInit() {

  }

  loginWithFacebook() {
    // this.cognitoLoginService.authenticateWithFacebook(this);
    this.amplifyService.auth();
  }

  fbCallback(message: string, result: any) {

    console.log('LoginComponent: fbCallback --> result ' + JSON.stringify(result));

    if (message === null) {
      this.router.navigate(['/ticket']);

    } else {

      const toastOptions: ToastOptions = {
        title: 'Error',
        msg: message,
        showClose: true,
        timeout: 15000,
        onAdd: (toast: ToastData) => {
          console.log('Toast ' + toast.id + ' has been added!');
        },
        onRemove: function(toast: ToastData) {
          console.log('Toast ' + toast.id + ' has been removed!');
        }
      };
      // Add see all possible types in one shot
      this.toastaService.error(toastOptions);
    }
  }


}
