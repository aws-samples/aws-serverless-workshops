import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {CognitoLoginService, CognitoService} from '../services/cognito.service';
import {TicketService} from '../services/ticket.service';

@Component({
  selector: 'app-views',
  templateUrl: './views.component.html'
})
export class ViewsComponent implements OnInit {

  public region =  '';

  constructor(public router: Router,
              public ticketService: TicketService,
              public cognitoService: CognitoService, // used in UI
              public cognitoLoginService: CognitoLoginService) { }

  ngOnInit() {
    if (this.router.url === '/') {
      this.router.navigate(['/home']);
    }

    this.callHealth();
  }

  callHealth() {
    this.ticketService.getHealth()
      .subscribe(
        data => {
          console.log('DATA: ' + data);
          this.region = data.region;
        },
        error => {
          console.log('ERROR: ' + error);

        }
      );
  }

  onLoggedout() {

    this.cognitoLoginService.logout();

    this.router.navigate(['/home']);
  }
}
