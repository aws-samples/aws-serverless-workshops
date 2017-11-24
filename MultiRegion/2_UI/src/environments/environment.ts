export const environment = {

  production: true,

  // TODO: make sure you have the correct region
  region: 'eu-west-1',


  // TODO: This id can be retrieved in output section of the cognito ui
  // cloud formation stack.
  cognitoIdentityPoolId: '',

  // TODO: Facebook app id can be retrieved from the application in your
  // facebook developer account.
  facebookAppId: '',

  // TODO: The API URL is available in the outputs section of the cloud formation template.
  // cloud front NOTE: don't forget trailing "/"  For example:
  // Note that when you test the UI for the first time, the ticketAPI URL will have /prod/
  // When you update this file with the final ticketAPI URL, it will NOT have /prod/ at the end
  // https://api.example.com/
  ticketAPI: ''

};
