var http = require('http');
var url = require('url');
var qs = require('querystring');
var template = require('./lib/template');
var db = require('./lib/db');
var topic = require('./lib/topic');
var author = require('./lib/author');
var login = require('./lib/login');

var app = http.createServer(function(request, response) {
  var _url = request.url;
  var queryData = url.parse(_url, true).query;
  var pathname = url.parse(_url, true).pathname;
  var isOwner = login.login_Check(request, response);
  console.log('isOwner :', isOwner);

  if (pathname === '/') {
    if (queryData.id === undefined) {
      topic.home(request, response, login.authStatusUI(isOwner));
    } else {
      topic.page(request, response);
    }
  } else if (pathname === '/create') {
    topic.create(request, response);
  } else if (pathname === '/create_process') {
    topic.create_process(request, response);
  } else if (pathname === '/update') {
    topic.update(request, response);
  } else if (pathname === '/update_process') {
    topic.update_process(request, response);
  } else if (pathname === '/delete_process') {
    topic.delete_process(request, response);
  } else if (pathname === '/author') {
    author.home(request, response);
  } else if (pathname === '/author/create_process') {
    author.create_process(request, response);
  } else if (pathname === '/author/update') {
    author.update(request, response);
  } else if (pathname === '/author/update_process') {
    author.update_process(request, response);
  } else if (pathname === '/author/delete_process') {
    author.delete_process(request, response);
  } else if (pathname === '/login') {
    login.login(request, response);
  } else if (pathname === '/login_process') {
    login.login_process(request, response);
  } else if (pathname === '/logout_process') {
    login.logout_process(request, response);
  } else {
    response.writeHead(404);
    response.end('Not found');
  }
});
app.listen(3000);
