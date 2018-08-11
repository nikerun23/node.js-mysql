var db = require('./db');
var template = require('./template');

exports.home = function(request, response){
  db.query("select * from topic", function(error, topics){
    db.query("select * from author", function(error2, authors){
      console.log(authors);
      if (error) throw error;
      var title = 'Welcome';
      var list = template.list(topics);
      var html = template.HTML(title, list,
        `
        ${template.authorTable(authors)}
        <style>
          table{
            border-collapse: collapse;
          }
          td{
            border:1px solid black;
          }
        </style>`,
      `
      <form action="create_process">
        <p>
          <input type="name" placeholder="name"/>
        </p>
        <p>
          <textarea name="profile" cols="20" rows="5"></textarea>
        </p>
        <input type="submit"/>
      </form>
      `);
      response.writeHead(200);
      response.end(html);
    });
  });
};
