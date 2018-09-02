var db = require('./db');
var template = require('./template');
var qs = require('querystring');

exports.login = function(request, response) {

  db.query("select * from topic", function(error, results, fields) {
    var title = 'Login'
    var description = 'Login Page';
    var list = template.list(results);
    var html = template.LOGIN(title, list,
      `<h2>${title}</h2>${description}
      <form action="login_process" method="post">
        <input type="text" name="id" placeholder="ID"/>
        <input type="password" name="pw" placeholder="PW"/>
        <input type="submit" value="Login"/>
      </form>`,
      ``
    );
    response.writeHead(200);
    response.end(html);
  });
};

exports.login_process = function(request, response){
  var body = '';
  request.on('data', function(data){
    body += data;
  });
  request.on('end', function(){
    var post = qs.parse(body);
    if (post.id === 'lee' && post.pw === 'qwer') {
      response.writeHead(302, {Location: '/', 'Set-Cookie':[
        `id=${post.id}`,
        `pw=${post.pw}`
      ]});
    } else {
      response.writeHead(302, {Location: '/'});
    }

    response.end();
  });

};

exports.logout_process = function(request, response) {
  var cookies = {};
  if(request.headers.cookie !== undefined) {
    cookies = cookie.parse(request.headers.cookie);
  }
  console.log(cookies);

  response.writeHead(200, {Location: '/'});
  response.end();
};
