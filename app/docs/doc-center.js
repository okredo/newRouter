"use strict";

angular.module('doc-center', [])
.service('docService', DocService)

.component('docCenter', {
  template: '<h3>Reference Guide</h3><ng-outlet></ng-outlet>',
  $routeConfig: [
	{path:'/',    name: 'DocList',   component: 'docList', useAsDefault: true},
	{path:'/:id', name: 'DocDetail', component: 'docDetail'}
  ]
})

.component('docList', {
  templateUrl: 'app/docs/docList.html',
  bindings: { $router: '<' },
  controller: DocListComponent,
  $canActivate: function($nextInstruction, $prevInstruction) {
	console.log('$canActivate', arguments);
  }
})

.component('docDetail', {
  templateUrl: 'app/docs/docDetail.html',
  bindings: { $router: '<' },
  controller: DocDetailComponent
});


function DocService($q) {
  var docsPromise = $q.when([
	{id: 1, name: 'General Overview'},
	{id: 2, name: 'Concepts'},
	{id: 3, name: 'API Guides'},
	{id: 4, name: 'API Reference'},
	{id: 5, name: 'System Administration Guide'}
  ]);

  this.getDocs = function() {
	return docsPromise;
  };

  this.getDoc = function(id) {
	return docsPromise.then(function(docs) {
	  for(var i=0; i<docs.length; i++) {
		if ( docs[i].id == id) return docs[i];
	  }
	});
  };
}

function DocListComponent(docService) {
  var selectedId = null;
  var ctrl = this;

  this.$routerOnActivate = function(next) {
	console.log('$routerOnActivate', this, arguments);
	// Load up the docs for this view
	docService.getDocs().then(function(docs) {
	  ctrl.docs = docs;
	  selectedId = next.params.id;
	});
  };

  this.isSelected = function(doc) {
	return (doc.id == selectedId);
  };

  this.onSelect = function(doc) {
	this.$router.navigate(['DocDetail', { id: doc.id }]);
  };
};

function DocDetailComponent(docService, dialogService) {
  var ctrl = this;
  this.$routerOnActivate = function(next) {
	// Get the doc identified by the route parameter
	var id = next.params.id;
	docService.getDoc(id).then(function(doc) {
	  if (doc) {
		ctrl.editName = doc.name;
		ctrl.doc = doc;
	  } else { // id not found
		ctrl.gotoDocs();
	  }
	});
  };

  this.$routerCanDeactivate = function() {
	console.log(this.doc.name, 'this.doc.name');
	console.log(this.editName, 'this.editName');

	// Allow synchronous navigation (`true`) if no doc or the doc is unchanged.
	if (!this.doc || this.doc.name === this.editName) {

	  console.log('no change?');
	  return true;
	}
	// Otherwise ask the user with the dialog service and return its
	// promise which resolves to true or false when the user decides
	return dialogService.confirm('Discard changes?');
  };

  this.cancel = function() {
	ctrl.editName = ctrl.doc.name;
	ctrl.gotoDocs();
  };

  this.save = function() {
	ctrl.doc.name = ctrl.editName;
	ctrl.gotoDocs();
  };

  this.gotoDocs = function() {
	var docId = ctrl.doc && ctrl.doc.id;
	// Pass along the hero id if available
	// so that the DocListComponent can select that hero.
	this.$router.navigate(['DocList', {id: docId}]);
  };
}















