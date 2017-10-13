import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {CognitoLoginService, CognitoService} from '../services/cognito.service';

@Component({
  selector: 'app-views',
  templateUrl: './views.component.html'
})
export class ViewsComponent implements OnInit {

  constructor(public router: Router,
              public cognitoService: CognitoService,
              public cognitoLoginService: CognitoLoginService) { }

  ngOnInit() {
    if (this.router.url === '/') {
      this.router.navigate(['/home']);
    }
  }

  onLoggedout() {

    localStorage.removeItem('isLoggedin');
    this.cognitoLoginService.logout();

    this.router.navigate(['/home']);
  }
}
