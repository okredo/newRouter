"use strict";

angular.module('admin', [])
.service('configService', ConfigService)

.component('admin', {
  template: '<h3>System Administration and Configuration</h3><ng-outlet></ng-outlet>',
  $routeConfig: [
	{path: '/',    name: 'ConfigList',   component: 'configList', useAsDefault: true},
	{path: '/:id', name: 'ConfigDetail', component: 'configDetail'}
  ]
})

.component('configList', {
  templateUrl:'/app/admin/adminList.html',
  bindings: { $router: '<' },
  controller: ConfigListComponent,
  $canActivate: function($nextInstruction, $prevInstruction) {
	console.log('$canActivate', arguments);
  }
})

.component('configDetail', {
  template:
  '<div ng-if="$ctrl.config">\n' +
  '  <h3>"{{$ctrl.config.name}}"</h3>\n' +
  '  <div>\n' +
  '    <label>Id: </label>{{$ctrl.config.id}}</div>\n' +
  '  <div>\n' +
  '    <label>Name: </label>\n' +
  '    <input ng-model="$ctrl.config.name" placeholder="name"/>\n' +
  '  </div>\n' +
  '  <button ng-click="$ctrl.gotoConfigs()">Back</button>\n' +
  '</div>\n',
  bindings: { $router: '<' },
  controller: ConfigDetailComponent
});


function ConfigService($q) {
  var configsPromise = $q.when([
	{ id: 11, name: 'Mr. Nice' },
	{ id: 12, name: 'Narco' },
	{ id: 13, name: 'Bombasto' },
	{ id: 14, name: 'Celeritas' },
	{ id: 15, name: 'Magneta' },
	{ id: 16, name: 'RubberMan' }
  ]);

  this.getConfigs = function() {
	return configsPromise;
  };

  this.getConfig = function(id) {
	return configsPromise.then(function(configs) {
	  for(var i=0; i<configs.length; i++) {
		if ( configs[i].id == id) return configs[i];
	  }
	});
  };
}

function ConfigListComponent(configService) {
  var selectedId = null;
  var $ctrl = this;

  this.$routerOnActivate = function(next, previous) {
	// Load up the configs for this view
	return configService.getConfigs().then(function(configs) {
	  $ctrl.configs = configs;
	  selectedId = next.params.id;
	});
  };

  this.isSelected = function(config) {
	return (config.id == selectedId);
  };

  this.onSelect = function(config) {
	this.$router.navigate(['ConfigDetail', { id: config.id }]);
  };

}

function ConfigDetailComponent(configService) {
  var $ctrl = this;

  this.$routerOnActivate = function(next, previous) {
	// Get the config identified by the route parameter
	var id = next.params.id;
	return configService.getConfig(id).then(function(config) {
	  $ctrl.config = config;
	});
  };

  this.gotoConfigs = function() {
	var configId = this.config && this.config.id;
	this.$router.navigate(['ConfigList', {id: configId}]);
  };
}