fetch(`${Wildrydes.config.apiUrl}/emails`, {
  headers: { Authorization: readCookie('authToken') }
}).
  then((response) => response.json()).
  then((json) => {
    var list = document.querySelector('ul#emails');

    json.Emails.forEach((email) => {
      var item= document.createElement('li');
      item.appendChild(document.createTextNode(email));
      list.appendChild(item);
    });
  });
