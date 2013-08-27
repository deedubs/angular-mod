angular.module('ma:settings', [])
  .controller('settings:edit', <% include controllers/edit.js %>)
  .controller('settings:show', <% include controllers/show.js %>)
  .config(function ($routeProvider) {
    
    $routeProvider
      .when('/settings', {
        controller: 'settings:show',
        template: <%- template('views/show.jade') %>
      });    
  });