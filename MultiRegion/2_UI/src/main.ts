import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

import Amplify from 'aws-amplify';

Amplify.configure({
  Auth: {

    // REQUIRED only for Federated Authentication - Amazon Cognito Identity Pool ID
    identityPoolId: environment.cognitoIdentityPoolId,

    // REQUIRED - Amazon Cognito Region
    region: environment.region
  }
});


if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule);
