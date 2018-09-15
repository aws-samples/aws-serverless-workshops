export const environment = {

  production: true,

  // TODO: make sure you have the correct region
  region: 'us-east-1',


  // TODO: This id can be retrieved in output section of the cognito ui
  // cloud formation stack.
  cognitoIdentityPoolId: 'us-east-1:f0558b0f-c436-4ed1-830f-270d6dcfc8e1',

  // TODO: Facebook app id can be retrieved from the application in your
  // facebook developer account.
  facebookAppId: '289290428556845',

  // TODO: The API URL is available in the API Gateway console under Stage
  // NOTE: don't forget trailing "/"  For example:
  // https://api.example.com/prod/
  ticketAPI: 'https://7fepp2xfh3.execute-api.us-east-1.amazonaws.com/prod/'

};
