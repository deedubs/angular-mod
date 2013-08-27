var express = require('express')
var app = express();
var fs = require('fs');
var jade = require('jade');
var stylus = require('stylus');
var glob = require('glob');

var deps;

updateDeps();

app.use(express.static('../'));

app.engine('.js', require('ejs').__express);

app.locals.template = function (template) {
  var paths = this.filename.split('/');
  paths.pop();
  
  return "'" + jade.render(fs.readFileSync(paths.join('/') + "/" + template)) + "'";
}

app.get('/index.js', function (req, res) {
  res.render('../app/index.js', {app: {
    deps: ['ngRoute','ngResource'].concat(deps.map(function (m) { return 'ma:' + m}))
  }})  
})

app.get('/index.css', function (req, res) {
  var compiler = stylus('').include(require('nib').path)

  glob(__dirname + '/../app/modules/*/css/*.styl', function (err, stylusFiles) {

    stylusFiles.forEach( function (f) {
      compiler.import(f);
    })
    
    compiler.render(function (err, css) {
      res.set('Content-Type', 'text/css');
      res.send(css);
    })
  })
})

deps.forEach(function (dep) {
  app.get('/modules/' + dep + '.js', function (req, res) {
    res.render('../app/modules/' + dep + '/index.js');
  });
})


app.use(function (req, res) {
  res.render('../app/index.jade', {deps: deps});  
})

app.listen(3000);

function updateDeps() {
  deps = fs.readdirSync(__dirname + '/../app/modules');
}

setInterval(updateDeps, 500);
