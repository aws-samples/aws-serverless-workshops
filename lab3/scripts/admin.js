var logout = document.querySelector('a#logout');

if (logout) {
  logout.addEventListener('click', (event) => {
    event.preventDefault();
    document.cookie = 'authToken=';
    window.location = '/admin/login.html';
  });
}

window.onload = () => {
  if (!readCookie('authToken')) {
    window.location.replace('/admin/login.html');
  }
}
