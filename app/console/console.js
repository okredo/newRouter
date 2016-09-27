"use strict";

angular.module('console', [])
.service('consoleService', ConsoleService)

.component('console', {
  template: '<h3>Console</h3><ng-outlet></ng-outlet>',
  $routeConfig: [
	{path: '/',    name: 'ConsoleList',   component: 'consoleList', useAsDefault: true},
	{path: '/:id', name: 'ConsoleDetail', component: 'consoleDetail'}
  ]
})

.component('consoleList', {
  templateUrl:'/app/console/consoleList.html',
  bindings: { $router: '<' },
  controller: ConsoleListComponent,
  $canActivate: function($nextInstruction, $prevInstruction) {
	console.log('$canActivate', arguments);
  }
})

.component('consoleDetail', {
  template:
  '<div ng-if="$ctrl.console">\n' +
  '  <h3>"{{$ctrl.console.name}}"</h3>\n' +
  '  <div>\n' +
  '    <label>Id: </label>{{$ctrl.console.id}}</div>\n' +
  '  <div>\n' +
  '    <label>Name: </label>\n' +
  '    <input ng-model="$ctrl.console.name" placeholder="name"/>\n' +
  '  </div>\n' +
  '  <button ng-click="$ctrl.gotoConsoles()">Back</button>\n' +
  '</div>\n',
  bindings: { $router: '<' },
  controller: ConsoleDetailComponent
});


function ConsoleService($q) {
  var consolesPromise = $q.when([
	{ id: 11, name: 'Mr. Nice' },
	{ id: 12, name: 'Narco' },
	{ id: 13, name: 'Bombasto' },
	{ id: 14, name: 'Celeritas' },
	{ id: 15, name: 'Magneta' },
	{ id: 16, name: 'RubberMan' }
  ]);

  this.getConsoles = function() {
	return consolesPromise;
  };

  this.getConsole = function(id) {
	return consolesPromise.then(function(consoles) {
	  for(var i=0; i<consoles.length; i++) {
		if ( consoles[i].id == id) return consoles[i];
	  }
	});
  };
}

function ConsoleListComponent(consoleService) {
  var selectedId = null;
  var $ctrl = this;

  this.$routerOnActivate = function(next, previous) {
	// Load up the consoles for this view
	return consoleService.getConsoles().then(function(consoles) {
	  $ctrl.consoles = consoles;
	  selectedId = next.params.id;
	});
  };

  this.isSelected = function(console) {
	return (console.id == selectedId);
  };

  this.onSelect = function(console) {
	this.$router.navigate(['ConsoleDetail', { id: console.id }]);
  };

}

function ConsoleDetailComponent(consoleService) {
  var $ctrl = this;

  this.$routerOnActivate = function(next, previous) {
	// Get the console identified by the route parameter
	var id = next.params.id;
	return consoleService.getConsole(id).then(function(console) {
	  $ctrl.console = console;
	});
  };

  this.gotoConsoles = function() {
	var consoleId = this.console && this.console.id;
	this.$router.navigate(['ConsoleList', {id: consoleId}]);
  };
}