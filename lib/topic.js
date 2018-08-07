
var db = require('./db');
var template = require('./template');

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
