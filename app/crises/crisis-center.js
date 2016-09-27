"use strict";

angular.module('crisis-center', [])
.service('crisisService', CrisisService)

.component('crisisCenter', {
  template: '<h3>Crisis Center</h3><ng-outlet></ng-outlet>',
  $routeConfig: [
	{path:'/',    name: 'CrisisList',   component: 'crisisList', useAsDefault: true},
	{path:'/:id', name: 'CrisisDetail', component: 'crisisDetail'}
  ]
})

.component('crisisList', {
  templateUrl: 'app/crises/crisisList.html',
  bindings: { $router: '<' },
  controller: CrisisListComponent,
  $canActivate: function($nextInstruction, $prevInstruction) {
	console.log('$canActivate', arguments);
  }
})

.component('crisisDetail', {
  templateUrl: 'app/crises/crisisDetail.html',
  bindings: { $router: '<' },
  controller: CrisisDetailComponent
});


function CrisisService($q) {
  var crisesPromise = $q.when([
	{id: 1, name: 'Princess Held Captive'},
	{id: 2, name: 'Dragon Burning Cities'},
	{id: 3, name: 'Giant Asteroid Heading For Earth'},
	{id: 4, name: 'Release Deadline Looms'}
  ]);

  this.getCrises = function() {
	return crisesPromise;
  };

  this.getCrisis = function(id) {
	return crisesPromise.then(function(crises) {
	  for(var i=0; i<crises.length; i++) {
		if ( crises[i].id == id) return crises[i];
	  }
	});
  };
}

function CrisisListComponent(crisisService) {
  var selectedId = null;
  var ctrl = this;

  this.$routerOnActivate = function(next) {
	console.log('$routerOnActivate', this, arguments);
	// Load up the crises for this view
	crisisService.getCrises().then(function(crises) {
	  ctrl.crises = crises;
	  selectedId = next.params.id;
	});
  };

  this.isSelected = function(crisis) {
	return (crisis.id == selectedId);
  };

  this.onSelect = function(crisis) {
	this.$router.navigate(['CrisisDetail', { id: crisis.id }]);
  };
};

function CrisisDetailComponent(crisisService, dialogService) {
  var ctrl = this;
  this.$routerOnActivate = function(next) {
	// Get the crisis identified by the route parameter
	var id = next.params.id;
	crisisService.getCrisis(id).then(function(crisis) {
	  if (crisis) {
		ctrl.editName = crisis.name;
		ctrl.crisis = crisis;
	  } else { // id not found
		ctrl.gotoCrises();
	  }
	});
  };

  this.$routerCanDeactivate = function() {
	console.log(this.crisis.name, 'this.crisis.name');
	console.log(this.editName, 'this.editName');

	// Allow synchronous navigation (`true`) if no crisis or the crisis is unchanged.
	if (!this.crisis || this.crisis.name === this.editName) {

	  console.log('no change?');
	  return true;
	}
	// Otherwise ask the user with the dialog service and return its
	// promise which resolves to true or false when the user decides
	return dialogService.confirm('Discard changes?');
  };

  this.cancel = function() {
	ctrl.editName = ctrl.crisis.name;
	ctrl.gotoCrises();
  };

  this.save = function() {
	ctrl.crisis.name = ctrl.editName;
	ctrl.gotoCrises();
  };

  this.gotoCrises = function() {
	var crisisId = ctrl.crisis && ctrl.crisis.id;
	// Pass along the hero id if available
	// so that the CrisisListComponent can select that hero.
	this.$router.navigate(['CrisisList', {id: crisisId}]);
  };
}















