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
    response.writeHead(302, {Location: '/', 'Set-Cookie':[
      `id=${post.id}`,
      `pw=${post.pw}`
    ]});
    response.end();
  });

};

exports.logout_process = function(request, response) {
  response.writeHead(200, {Location: '/'});
  response.end();
};
