import {Component, OnInit} from '@angular/core';
import {ITicket} from '../../model/ticket';
import {FormGroup} from '@angular/forms';
import {TicketService} from '../../services/ticket.service';
import {CognitoService} from '../../services/cognito.service';
import {Router} from '@angular/router';
import {environment} from '../../../environments/environment';
import {ToastaService, ToastaConfig, ToastOptions, ToastData} from 'ngx-toasta';

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
              private toastaService: ToastaService, private toastaConfig: ToastaConfig,
              public ticketService: TicketService) {

    this.toastaConfig.theme = 'default';

    this.refresh();

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
          self.refresh();
        },
        error => this.errorMessage = <any>error);

  }

  refresh() {

    this.ticketService.getTickets()
      .subscribe(
        tickets => {
          this.rows = tickets.Items;
        },
        error => {
          console.log('ERROR: ' + error);

          const toastOptions: ToastOptions = {
            title: 'Error',
            msg: 'Please check your api URL configuration ' +
                 'and make sure it matches the output from Cloud Formation ' +
                 'template. Here is the url you have configured: ' + environment.ticketAPI,
            showClose: true,
            timeout: 5000,
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
      );
  }

}
