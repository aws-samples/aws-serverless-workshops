fetch(`${Wildrydes.config.apiUrl}/posts`).
  then((response) => response.json()).
  then((json) => {
    var posts = document.querySelector('#posts');
    var template = document.querySelector('#post');
    var title = template.content.querySelector('.title');
    var timestamp = template.content.querySelector('.timestamp');
    var body = template.content.querySelector('.body');

    json.Posts.forEach((post) => {
      title.textContent = post.Title;
      body.textContent = post.Body;
      timestamp.textContent = new Date(parseInt(post.Timestamp, 10)).
        toLocaleDateString('en-US', {
          weekday: "long", year: "numeric", month: "long", day: "numeric"
        });

      var clone = document.importNode(template.content, true);
      posts.appendChild(clone);
    });
  });
