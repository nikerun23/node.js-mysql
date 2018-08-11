var db = require('./db');
var template = require('./template');
var qs = require('querystring');

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
        <input type="submit"/>
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
