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

app.get('/index.js', function (req, res) {
  res.render('../lib/index.js', {app: {
    deps: ['ngRoute','ngResource'].concat(deps.map(function (m) { return 'ma:' + m}))
  }})  
})

deps.forEach(function (dep) {
  app.get('/modules/' + dep + '.js', function (req, res) {
    res.render('../modules/' + dep + '/index.js');
  });
})


app.use(function (req, res) {
  res.render('../lib/index.jade', {deps: deps});  
})

app.listen(3000);

function updateDeps() {
  deps = fs.readdirSync(__dirname + '/../modules');
}

setInterval(updateDeps, 500);
