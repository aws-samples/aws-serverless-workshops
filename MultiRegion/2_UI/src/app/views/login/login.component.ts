import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {
  CognitoLoginService, CognitoService,
  FacebookCallback
} from '../../services/cognito.service';
import {Router} from '@angular/router';
import {ToastaService, ToastaConfig, ToastOptions, ToastData} from 'ngx-toasta';
import { AmplifyService } from 'aws-amplify-angular';
import { Auth } from 'aws-amplify';

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
              public cognitoService: CognitoService,
              private amplifyService: AmplifyService) {

    this.toastaConfig.theme = 'default';

  }

  ngOnInit() {

  }

  loginWithFacebook() {
    this.cognitoLoginService.authenticateWithFacebook(this);
  }

  fbCallback(message: string, reponse: any) {

    console.log('LoginComponent: fbCallback --> result ' + JSON.stringify(reponse));

    const that = this;

    if (message === null) {
      Auth.federatedSignIn(
        'facebook',
        {
          token: reponse.accessToken,
          expires_at: reponse.expiresIn
        },
        reponse.userID
      ).then(credentials => {
          console.log('Auth.federatedSignIn FULFILLED  credentials --> ' + JSON.stringify(credentials));

          that.router.navigate(['/ticket']);
        }
      ).catch(err => {
          console.log('Auth.federatedSignIn REJECTED-->' + err);
      });
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
