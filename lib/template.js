module.exports = {
  HTML:function(title, list, body, control){
    return `
    <!doctype html>
    <html>
    <head>
      <title>WEB1 - ${title}</title>
      <meta charset="utf-8">
    </head>
    <body>
      <h1><a href="/">WEB</a></h1>
      <a href="/author">author</a>
      ${list}
      ${control}
      ${body}
    </body>
    </html>
    `;
  },
  list:function(topics){
    var list = '<ul>';
    var i = 0;
    while(i < topics.length){
      list = list + `<li><a href="/?id=${topics[i].id}">${topics[i].title}</a></li>`;
      i = i + 1;
    }
    list = list+'</ul>';
    return list;
  },
  authorSelect:function(authors, author_id){
    var selectTag = ``;
    for (var i=0, len=authors.length; i<len; i++) {
      var selected = '';
      if (authors[i].id === author_id) {
        selected = 'selected';
      }
      selectTag += `<option value="${authors[i].id}" ${selected}>${authors[i].name}</option>`;
    }
    return `
      <select name="author">
        ${selectTag}
      </select>
      `;
  },
  authorTable:function(authors){
    var trTag = '';
    for (var u in authors){
      trTag += `<tr>`;
      trTag += `<td>${authors[u].name}</td>`;
      trTag += `<td>${authors[u].profile}</td>`;
      trTag += `<td><a href="/author/update?id=${authors[u].id}">update</a></td>`;
      trTag += `<td><form action="/author/delete_process" method="post">
                  <input type="hidden" name="id" value="${authors[u].id}"/>
                  <input type="submit" value="Delete"/>
                </form></td>`;
      trTag += `</tr>`;
    }

    return `
    <table>
      <tr>
        <td>name</td>
        <td>profile</td>
        <td>update</td>
        <td>delete</td>
      </tr>
      ${trTag}
    </table>
    `;
  }
}
