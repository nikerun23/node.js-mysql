
var db = require('./db');
var template = require('./template');
var url = require('url');
var qs = require('querystring');


exports.home = function(request, response) {
  db.query("select * from topic", function(error, results, fields) {
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
};

exports.page = function(request, response){
  var _url = request.url;
  var queryData = url.parse(_url, true).query;
  db.query("select * from topic", function(error, results, fields) {
    if (error) throw error;
    db.query(`select topic.title, topic.description, author.name
          from topic LEFT JOIN author
          ON topic.author_id=author.id
          where topic.id = ?`, [queryData.id], function(error2, topic, fields) {
      if (error2) throw error2;
      var title = topic[0].title;
      var description = topic[0].description;
      var name = topic[0].name;
      var list = template.list(results);
      var html = template.HTML(title, list,
        `<h2>${title}</h2><p>${description}</p>${name}`,
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
};

exports.create = function(request, response){
  db.query("select * from topic", function(error, results, fields) {
    db.query("select * from author", function(error2, authors) {
      var title = 'WEB - create';
      var selectTag = template.authorSelect(authors);
      var list = template.list(results);
      var html = template.HTML(title, list, `
        <form action="/create_process" method="post">
          <p><input type="text" name="title" placeholder="title"></p>
          <p>
            <textarea name="description" placeholder="description"></textarea>
          </p>
          <p>
            ${selectTag}
          </p>
          <p>
            <input type="submit">
          </p>
        </form>
      `, '');
      response.writeHead(200);
      response.end(html);
    });
  });
};

exports.create_process = function(request, response){
  var body = '';
  request.on('data', function(data) {
    body = body + data;
  });
  request.on('end', function() {
    var post = qs.parse(body);
    db.query("INSERT INTO topic (title, description, created, author_id) \
        VALUES(?, ?, NOW(), ?)", [post.title, post.description, post.author], function(error, result) {
      if (error) throw error;
      response.writeHead(302, {
        Location: `/?id=${result.insertId}`
      });
      response.end();
    });
  });
};

exports.update = function(request, response){
  var _url = request.url;
  var queryData = url.parse(_url, true).query;
  db.query("select * from topic", function(error, results) {
    if (error) throw error;
    db.query(`select * from topic where id = ?`, [queryData.id], function(error2, topic) {
      db.query("select * from author", function(error2, authors) {
        if (error2) throw error2;
        var id = queryData.id;
        var title = topic[0].title;
        var description = topic[0].description;
        var selectTag = template.authorSelect(authors, topic[0].author_id);
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
                ${selectTag}
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
  });
};

exports.update_process = function(request, response){
  var body = '';
  request.on('data', function(data) {
    body = body + data;
  });
  request.on('end', function() {
    var post = qs.parse(body);
    var id = post.id;
    db.query("UPDATE topic SET title=?, description=?, author_id=? WHERE id=?",
    [post.title, post.description, post.author, id], function(error, result) {
      if (error) throw error;
      response.writeHead(302, {
        Location: `/?id=${id}`
      });
      response.end();
    });
  });
};

exports.delete_process = function(request, response){
  var body = '';
  request.on('data', function(data) {
    body = body + data;
  });
  request.on('end', function() {
    var post = qs.parse(body);
    var id = post.id;
    db.query("DELETE FROM topic WHERE id = ?", [id], function(error, result) {
      if (error) throw error;
      response.writeHead(302, {
        Location: `/`
      });
      response.end();
    });
  });
};
