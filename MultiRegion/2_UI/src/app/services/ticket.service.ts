import {Http, RequestOptions, Response, Headers} from '@angular/http';
import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import 'rxjs/add/operator/map';
import {Observable} from 'rxjs';
import {ITicket} from '../model/ticket';

@Injectable()
export class TicketService {

    private _API_ROOT = environment.ticketAPI;

    constructor ( private http: Http) {

    }

    /**
     *
     * @returns {Observable<any>}
     */
    getTickets() {
        return this.http.get(this._API_ROOT + 'ticket')
            .map((res: Response) => res.json());
    }

    getHealth() {
        return this.http.get(this._API_ROOT + 'health')
            .map((res: Response) => res.json());
    }

    addTicket(ticket: ITicket): Observable<ITicket> {

      const headers = new Headers({ 'Content-Type': 'application/json' });
      const options = new RequestOptions({ headers: headers });

      return this.http.post(this._API_ROOT + 'ticket', ticket, options)
        .map(this.extractData);
        // .catch(this.handleErrorObservable);

    }

    private extractData(res: Response) {
      const body = res.json();
      return body || {};
    }

    private handleErrorObservable (error: Response | any) {
      console.error(error.message || error);
      return Observable.throw(error.message || error);
    }

    private handleErrorPromise (error: Response | any) {
      console.error(error.message || error);
      return Promise.reject(error.message || error);
    }

}
