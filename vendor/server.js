var express = require('express')
var app = express();
var fs = require('fs');
var jade = require('jade');

var deps = fs.readdirSync(__dirname + '/../modules')

app.use(express.static('../'));

app.engine('.js', require('ejs').__express);

app.locals.template = function (template) {
  var paths = this.filename.split('/');
  paths.pop();
  
  return "'" + jade.render(fs.readFileSync(paths.join('/') + "/" + template)) + "'";
}

app.get('/', function (req, res) {
  res.render('../index.jade', {deps: deps});  
})

app.get('/index.js', function (req, res) {
  res.render('../index.js', {app: {
    deps: deps.map(function (m) { return 'ma:' + m})
  }})  
})

deps.forEach(function (dep) {
  app.get('/modules/' + dep + '.js', function (req, res) {
    res.render('../modules/' + dep + '/index.js');
  });
})

app.listen(3000);