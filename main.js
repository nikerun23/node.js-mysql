var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
var template = require('./lib/template.js');
var path = require('path');
var sanitizeHtml = require('sanitize-html');
var mysql = require('mysql');

var db = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'wlsldjtm23',
  database : 'opentutorials'
});
db.connect();

var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;
    if(pathname === '/'){
      if(queryData.id === undefined){
        db.query("select * from topic",function(error, results, fields){
          var title = 'Welcome';
          var description = 'Hello, Node.js';
          var list = template.list(results);
          var html = template.HTML(title, list,
            `<h2>${title}</h2>${description}`,
            `<a href="/create">create</a>`
          );
          response.writeHead(200);
          response.end(html);
        });
      } else {
        db.query("select * from topic",function(error, results, fields){
          if (error) throw error;
          db.query(`select * from topic where id = ?`,[queryData.id],function(error2, topic, fields){
            if (error2) throw error2;
            var title = topic[0].title;
            var description = topic[0].description;
            var list = template.list(results);
            var html = template.HTML(title, list,
              `<h2>${title}</h2>${description}`,
              `<a href="/create">create</a>
                <a href="/update?id=${queryData.id}">update</a>
                <form action="delete_process" method="post">
                  <input type="hidden" name="id" value="${queryData.id}">
                  <input type="submit" value="delete">
                </form>`
            );
            response.writeHead(200);
            response.end(html);
          });
        });
      }
    } else if(pathname === '/create'){
      db.query("select * from topic",function(error, results, fields){
        var title = 'WEB - create';
        var list = template.list(results);
        var html = template.HTML(title, list, `
          <form action="/create_process" method="post">
            <p><input type="text" name="title" placeholder="title"></p>
            <p>
              <textarea name="description" placeholder="description"></textarea>
            </p>
            <p>
              <input type="submit">
            </p>
          </form>
        `, '');
        response.writeHead(200);
        response.end(html);
      });
    } else if(pathname === '/create_process'){
      var body = '';
      request.on('data', function(data){
          body = body + data;
      });
      request.on('end', function(){
          var post = qs.parse(body);
          var title = post.title;
          var description = post.description;
          db.query("INSERT INTO topic (title, description, created, author_id) \
          VALUES(?, ?, NOW(), ?)",[title, description, 1], function(error, result){
              if (error) throw error;
              response.writeHead(302, {Location: `/?id=${result.insertId}`});
              response.end();
          });
      });
    } else if(pathname === '/update'){
      db.query("select * from topic",function(error, results){
          if (error) throw error;
        db.query("select * from topic where id = ?", [queryData.id],function(error2, topic){
            if (error2) throw error2;
          var id = queryData.id;
          var title = topic[0].title;
          var description = topic[0].description;
          var list = template.list(results);
          var html = template.HTML(title, list,
            `
            <form action="/update_process" method="post">
              <input type="hidden" name="id" value="${id}">
              <p><input type="text" name="title" placeholder="title" value="${title}"></p>
              <p>
                <textarea name="description" placeholder="description">${description}</textarea>
              </p>
              <p>
                <input type="submit">
              </p>
            </form>
            `,
            `<a href="/create">create</a> <a href="/update?id=${title}">update</a>`
          );
          response.writeHead(200);
          response.end(html);
        });
      });
    } else if(pathname === '/update_process'){
      var body = '';
      request.on('data', function(data){
          body = body + data;
      });
      request.on('end', function(){
          var post = qs.parse(body);
          var id = post.id;
          var title = post.title;
          var description = post.description;
          db.query("UPDATE topic \
          SET title=?, description=?, author_id=1 WHERE id=?",[title,description,id],function(error, result){
              if (error) throw error;
              response.writeHead(302, {Location: `/?id=${id}`});
              response.end();
          });
      });
    } else if(pathname === '/delete_process'){
      var body = '';
      request.on('data', function(data){
          body = body + data;
      });
      request.on('end', function(){
          var post = qs.parse(body);
          var id = post.id;
          db.query("DELETE FROM topic WHERE id = ?", [id], function(error, result){
              if (error) throw error;
              response.writeHead(302, {Location: `/`});
              response.end();
          });
      });
    } else {
      response.writeHead(404);
      response.end('Not found');
    }
});
app.listen(3000);
