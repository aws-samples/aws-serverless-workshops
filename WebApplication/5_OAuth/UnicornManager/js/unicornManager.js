/*global WildRydes _config*/

var UnicornManager = window.UnicornManager || {};

(function rideScopeWrapper($) {
    var authToken = getParameterByName("access_token");

    var cognitoError = getParameterByName("error");
    if (cognitoError != null && cognitoError != "") {
        displayUpdate(getParameterByName("error_description"));
    } else {
        if (authToken == null || authToken == "") {
            redirectToLogin();
        } else {
            $("#refresh").prop("disabled", false);
        }
    }

    function refresh() {
        $.ajax({
            method: 'GET',
            url: _config.api.invokeUrl + '/ride',
            headers: {
                Authorization: authToken
            },
            contentType: 'application/json',
            success: completeRequest,
            error: function ajaxError(jqXHR, textStatus, errorThrown) {
                console.error('Error requesting ride: ', textStatus, ', Details: ', errorThrown);
                console.error('Response: ', jqXHR.responseText);
                console.log("Status: " + jqXHR.status);
                if (jqXHR.status == 401 || jqXHR.status == 403) {
                    redirectToLogin();
                } else {
                    alert('An error occured when loading rides:\n' + jqXHR.responseText);
                }
            }
        });
    }

    function completeRequest(result) {
        console.log('Response received from API: ', result);
        var rows = "";
        for (var i = 0; i < result.length; i++) {
            rows += '<tr><td>' + result[i].RideId + '</td>' +
                '<td>' + result[i].RequestTime + '</td>' + 
                '<td>' + result[i].Unicorn.Color + '</td>' +
                '<td>' + result[i].User + '</td></tr>';
        }

        $("#rideList").html(
            "<table class='table'><thead class='thead'><tr><th>RideId</th><th>RequestTime</th><th>Unicorn Color</th><th>User</th></tr></thead>" +
            "<tbody>" +
            rows +
            "</tbody>" +
            "</table>"
        );
    }

    function getParameterByName(name, url) {
        if (!url) url = window.location.href;
        console.log("url: " + window.location.href);
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?#&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        console.log("results: " + results);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }

    function redirectToLogin() {
        if (!window._config.cognito.authDomainPrefix || 
            !window._config.cognito.userPoolClientId ||
            !window._config.cognito.region) {
                $('#noCognitoMessage').show();
                return;
            }

        loginUri = "https://" + 
                   window._config.cognito.authDomainPrefix +
                   ".auth." +
                   window._config.cognito.region +
                   ".amazoncognito.com" +
                   "/oauth2/authorize?response_type=token" +
                   "&client_id=" + window._config.cognito.userPoolClientId +
                   "&redirect_uri=" + location.protocol + '//' + location.host + '/' +
                   "&scope=UnicornManager/unicorn";
        
        console.log("Redirecting to: " + loginUri);

        window.location = loginUri;
    }

    // Register click handler for #request button
    $(function onDocReady() {
        $('#refresh').click(handleRefreshClick);
        
        if (UnicornManager.authToken) {
            displayUpdate('You are authenticated. Click to see your <a href="#authTokenModal" data-toggle="modal">auth token</a>.');
        }
        

        if (!_config.api.invokeUrl) {
            $('#noApiMessage').show();
        }
    });

    function handleRefreshClick(event) {
        event.preventDefault();
        refresh();
    }

    function displayUpdate(text) {
        $('#updates').append($('<li>' + text + '</li>'));
    }
}(jQuery));
