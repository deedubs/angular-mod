angular.module('ma:users', [])
  .controller('users:edit', <% include controllers/edit.js %>)
  .controller('users:show', <% include controllers/show.js %>);