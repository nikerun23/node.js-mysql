var db = require('./db');
var template = require('./template');
var qs = require('querystring');
var cookie = require('cookie');

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
      </form>`
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

  response.writeHead(302, {Location: '/', 'Set-Cookie':[
    `id=; Max-Age=0;`,
    `pw=; Max-Age=0;`
  ]});
  response.end();
};

exports.login_Check = function(request, response){
  var result = '';
  var cookies = {};

  if (request.headers.cookie) {
    cookies = cookie.parse(request.headers.cookie);
    if (cookies.id === 'lee' && cookies.pw === 'qwer') {
      result = cookies.id;
    }
  }

  return result;
};

exports.authStatusUI = function(isOwner) {
  var ui = '<a href="/login">login</a>';
  if (isOwner) {
    ui = `<a href="/logout_process">${isOwner}님 logOut</a>`;
  }
  return ui;
};
