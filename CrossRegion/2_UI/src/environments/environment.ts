// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {

  production: true,

  //TODO: make sure to use the appropriate region
  region: '',
  // region: 'ap-southeast-1',
  // region: 'eu-west-1',


  // TODO: These Ids can be retrieved by selecting the cognito cloud formation stack
  // after launch and looking at outputs section.
  cognitoIdentityPoolId: '',

  // TODO: Facebook app id can be retrieved from the application in your facebook developer account.
  facebookAppId: '111122223333444',

  // amazon client id can be retrieved from the application in your amazon developer account
  amazonLoginId: 'amzn1.application-oa2-client.ab99abc0a1112223z123a4d111a8f321',

  // TODO: These Ids can be retrieved by selecting the api cloud formation stack
  // after launch and looking at outputs section. NOTE: don't forget trailing "/"
  ticketAPI: ''

};
