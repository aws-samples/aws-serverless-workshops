var dynamoDB = new AWS.DynamoDB({});
var loginForm = document.querySelector('form');
var nav = document.querySelector('div#nav');
var emailInput = document.querySelector('form input[type="email"]');
var passwordInput = document.querySelector('form input[type="password"]');

loginForm.addEventListener('submit', function (event) {
  event.preventDefault();

  authenticate(emailInput.value, passwordInput.value, (token, expiration) => {
    document.cookie = `authToken=${token}; expires=${expiration.toUTCString()}`;
    window.location.replace('/admin');
  });
});

window.onload = () => {
  if (readCookie('authToken')) {
    window.location.replace('/admin');
  }
}

function authenticate(username, password, callback) {
  AWSCognito.config.region = Wildrydes.config.region;

  var poolData = {
    UserPoolId: Wildrydes.config.userPoolId,
    ClientId: Wildrydes.config.userPoolClientId
  };
  var userData = {
    Username: username,
    Pool: new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool(poolData)
  };
  var cognitoUser = new AWSCognito.CognitoIdentityServiceProvider.CognitoUser(userData);
  var authenticationData = {
    Username: username,
    Password: password
  };
  var authenticationDetails = new AWSCognito.CognitoIdentityServiceProvider.AuthenticationDetails(authenticationData);

  cognitoUser.authenticateUser(authenticationDetails, {
    onSuccess: function (result) {
      var expiration = new Date(result.getIdToken().getExpiration() * 1000);
      callback(result.getIdToken().getJwtToken(), expiration);
    },

    onFailure: function(err) {
      alert(err);
    },

    newPasswordRequired: function(userAttributes, requiredAttributes) {
      cognitoUser.completeNewPasswordChallenge(password, userAttributes, this)
    }
  });
}
