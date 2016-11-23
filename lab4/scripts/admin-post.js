document.querySelector('form').addEventListener('submit', (event) => {
  event.preventDefault();

  var title = document.querySelector('form input');
  var body = document.querySelector('form textarea');
  var headers = {
    Authorization: readCookie('authToken'),
    'Content-type': 'application/json'
  }
  var body = {
    Timestamp: new Date().getTime().toString(),
    Title: title.value,
    Body: body.value
  }

  fetch(`${Wildrydes.config.apiUrl}/posts`, {
    method: 'post',
    headers: headers,
    body: JSON.stringify(body)
  }).
    then(() => window.location = '/blog.html');
});
