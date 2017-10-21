/// <reference path="../../../../index.d.ts" />
import {Component, AfterViewInit, ChangeDetectionStrategy, Input, Output, EventEmitter} from '@angular/core';

export class AmazonAuthResponse {

  public authRequest: amazon.Login.AuthorizeRequest;

  constructor(authRequest: amazon.Login.AuthorizeRequest) {
    this.authRequest = authRequest;
  }
}

@Component({
  selector: 'amazon-login',
  template: `
    <a id="LoginWithAmazon" (click)="onClick()">
    <img border="0" alt="Login with Amazon"
      src="https://images-na.ssl-images-amazon.com/images/G/01/lwa/btnLWA_gold_156x32.png"
      width="156" height="32" />
    </a>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AmazonLoginComponent implements AfterViewInit {

  private id: string = 'amazon-root';

  // Options
  @Input() private clientId: string;

  @Output() amazonAuthResponse: EventEmitter<AmazonAuthResponse> = new EventEmitter<AmazonAuthResponse>();

  ngAfterViewInit() {
    this.loginInit();
  }

  private loginInit() {
    if (this.clientId == null)
      throw new Error(
        'clientId property is necessary. (<amazon-login [clientId]="..."></amazon-login>)');

    amazon.Login.setClientId(this.clientId);
  }

  private handleResponse(response: amazon.Login.AuthorizeRequest) {
    this.amazonAuthResponse.next(new AmazonAuthResponse(response));
  }

  private onClick() {
    amazon.Login.authorize( {scope: 'profile'}, (response: amazon.Login.AuthorizeRequest) => this.handleResponse(response));
  }
}
