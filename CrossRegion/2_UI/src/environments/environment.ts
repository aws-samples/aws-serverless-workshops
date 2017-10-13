// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  region: 'eu-west-1',


  // TODO 1: These Ids can be retrieved by selecting the cognito cloud formation stack
  // after launch and looking at outputs section.
  cognitoIdentityPoolId: 'eu-west-1:0d771d95-2757-4bbb-a7c7-aaf529c33269',

  // TODO 2: Facebook app id can be retrieved from the application you created in your facebook
  // developer account.
  // facebookAppId: '130815800866938', // prod bucket
  facebookAppId: '150165995589484', // localhost

  // TODO 3: These Ids can be retrieved by selecting the api cloud formation stack
  // after launch and looking at outputs section.
  ticketAPI: 'https://b3j27g0dg0.execute-api.eu-west-1.amazonaws.com/prod/'
};
