AWS.config.region = Wildrydes.config.region;
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
  IdentityPoolId: Wildrydes.config.identityPoolId
});

var dynamoDB = new AWS.DynamoDB({});
var emailForm = document.querySelector('form');
var emailInput = document.querySelector('form input');
var formDiv = document.querySelector('div#form');
var confirmationDiv = document.querySelector('div#thank-you');

emailForm.addEventListener('submit', function (event) {
  event.preventDefault();

  params = {
    TableName: 'Wildrydes_Emails',
    Item: {
      Email: {
        S: emailInput.value
      }
    }
  };

  dynamoDB.putItem(params, function (err, data) {
    if (err) {
      console.log(err);
    } else {
      formDiv.style.display = 'none';
      confirmationDiv.style.display = 'block';
    }
  });
});
