// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {

  production: true,

  //TODO: make sure to use the appropriate region. You are building this UI only in the primary region.
  // select the appropriate region for your deployment.
  // region: 'ap-southeast-1',
  region: 'eu-west-1',


  // TODO: This id can be retrieved in output section of the cognito ui cloud formation stack
  // Each region will have its own unique id.
  cognitoIdentityPoolId: '',

  // TODO: NOTE You can choose facebook or amazon (or both) as your identity provider(s).

  // TODO: Facebook app id can be retrieved from the application in your facebook developer account.
  facebookAppId: '111122223333444',

  // amazon client id can be retrieved from the application in your amazon developer account
  // if you don't use Amazon for you login, you must leave the dummy amazonLoginId below UNCOMMENTED
  amazonLoginId: 'amzn1.application-oa2-client.ab99abc0a1112223z123a4d111a8f321',

  // TODO: The API URL is available in the outputs section of the cloud formation template.
  // cloud front NOTE: don't forget trailing "/"
  ticketAPI: ''

};
