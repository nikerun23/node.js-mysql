var db = require('./db');
var template = require('./template');
var qs = require('querystring');
var url = require('url');

exports.home = function(request, response){
  db.query("select * from topic", function(error, topics){
    db.query("select * from author", function(error2, authors){
      if (error) throw error;
      var title = 'Welcome';
      var list = template.list(topics);
      var html = template.HTML(title, list,
      `
      <form action="author/create_process" method="post">
        <p>
          <input type="text" name="name" placeholder="name"/>
        </p>
        <p>
          <textarea name="profile" placeholder="description" cols="20" rows="5"></textarea>
        </p>
        <input type="submit" value="Add"/>
      </form>
      `,
      `
      ${template.authorTable(authors)}
      <style>
        table{
          border-collapse: collapse;
        }
        td{
          border:1px solid black;
        }
      </style>`,);
      response.writeHead(200);
      response.end(html);
    });
  });
};

exports.create_process = function(request, response){
  var body = '';
  request.on('data', function(data){
    body = body + data;
  });
  request.on('end', function(){
    var post = qs.parse(body);
    db.query('INSERT INTO author (name, profile) VALUES(?,?)',[post.name,post.profile], function(error, result){
      if (error) throw error;
    });
    response.writeHead(302, {Location: '/author'});
    response.end();
  });
};

exports.update = function(request, response){
  var _url = request.url;
  var queryData = url.parse(_url, true).query;
  db.query("select * from topic", function(error, topics){
    if (error) throw error;
    db.query("select * from author", function(error2, authors){
      if (error2) throw error2;
      db.query("select * from author where id = ?", [queryData.id], function(error3, author){
        if (error3) throw error3;
        var title = 'Welcome';
        var list = template.list(topics);
        var html = template.HTML(title, list,
        `
        <form action="/author/update_process" method="post">
          <input type="hidden" name="id" value="${author[0].id}"/>
          <p>
            <input type="text" name="name" placeholder="name" value="${author[0].name}"/>
          </p>
          <p>
            <textarea name="profile" placeholder="description" cols="20" rows="5">${author[0].profile}</textarea>
          </p>
          <input type="submit" value="Update"/>
        </form>
        `,
        `
        ${template.authorTable(authors)}
        <style>
          table{
            border-collapse: collapse;
          }
          td{
            border:1px solid black;
          }
        </style>`,);
        response.writeHead(200);
        response.end(html);
      });
    });
  });
};

exports.update_process = function(request, response){
  var body = '';
  request.on('data', function(data){
    body += data;
  });
  request.on('end', function(){
    var post = qs.parse(body);
    db.query("UPDATE author SET name = ?, profile = ? WHERE id = ?"
      , [post.name, post.profile, post.id], function(error, result){
      if (error) throw error;
      response.writeHead(302, {Location: '/author'});
      response.end();
    });
  });

};
