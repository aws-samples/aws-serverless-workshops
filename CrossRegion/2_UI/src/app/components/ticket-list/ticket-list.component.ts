import { Component, OnInit } from '@angular/core';
import {ITicket} from '../../model/ticket';
import {FormGroup} from '@angular/forms';
import {TicketService} from '../../services/ticket.service';
import {CognitoService} from '../../services/cognito.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-ticket-list',
  templateUrl: './ticket-list.component.html',
  styleUrls: ['./ticket-list.component.css']
})
export class TicketListComponent implements OnInit {

  ticketForm: FormGroup;

  model: ITicket = {
    id: 0,
    description: '',
    assigned: '',
    priority: '',
    status: '',
    createdBy: '',
    createdOn: ''
  };

  rows: Array<ITicket>;

  errorMessage: String;


  constructor(public router: Router,
              public cognitoService: CognitoService,
              public ticketService: TicketService) {

    this.ticketService.getTickets()
      .subscribe(
        tickets => {
          this.rows = tickets.Items;
          console.log('ROWS:' + this.rows);
        },
        error => {
          console.log("ERROR: " + error);
          this.router.navigate(['/troubleshooting']);
        }
      );
  }

  ngOnInit() {
  }

  onSubmit(form: FormGroup) {

    this.ticketForm = form;

    const self = this;
    this.model.createdBy = this.cognitoService.currentEmailID;

    this.ticketService.addTicket(this.model)
      .subscribe( ticket => {

          self.model = <ITicket> {
            id: 0,
            description: '',
            assigned: '',
            priority: '',
            status: '',
            createdBy: '',
            createdOn: ''
          };

          self.ticketForm.reset();
          console.log(ticket);
          self.rows.push(ticket);
        },
        error => this.errorMessage = <any>error);

  }

}
