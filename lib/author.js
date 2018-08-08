var db = require('./db');
var template = require('./template');

exports.home = function(request, response){
  db.query("select * from topic", function(error, topics){
    db.query("select * from author", function(error2, authors){
      console.log(authors);
      if (error) throw error;
      var title = 'Welcome';
      var trTag = ''
      for (var u in authors){
        trTag += `<tr>`;
        trTag += `<td>${authors[u].name}</td>`;
        trTag += `<td>${authors[u].profile}</td>`;
        trTag += `<td><a href="/update_process?id=${authors[u].id}">update</a></td>`;
        trTag += `<td><a href="/delete_process?id=${authors[u].id}">delete</a></td>`;
        trTag += `</tr>`;
      }

      var list = template.list(topics);
      var html = template.HTML(title, list,
        `<table>
          <tr>
            <td>name</td>
            <td>profile</td>
            <td>update</td>
            <td>delete</td>
          </tr>
          ${trTag}
        </table>
        <style>
          table{
            border-collapse: collapse;
          }
          td{
            border:1px solid black;
          }
        </style>`,
      `control`);
      response.writeHead(200);
      response.end(html);
    });
  });
};
