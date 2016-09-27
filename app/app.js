angular.module('app', ['ngMaterial', 'ngComponentRouter', 'dialog', 'doc-center', 'console', 'admin'])

.config(function($mdThemingProvider) {
  $mdThemingProvider.theme('default')
  .accentPalette('blue');
  //.dark();
})

.config(function($locationProvider) {
  $locationProvider.html5Mode(true);
})

.value('$routerRootComponent', 'app')

.component('app', {
  templateUrl:'app/main.html',
  $routeConfig: [
    {path: '/doc-center/...', name: 'DocCenter', component: 'docCenter', useAsDefault: true},
    {path: '/console/...', name: 'Console', component: 'console'},
    {path: '/admin/...', name: 'Admin', component: 'admin'},
    {path: '/apps/...', name: 'Apps', component: 'apps'},
    {path: '/disaster', name: 'Asteroid', redirectTo: ['DocCenter', 'DocDetail', {id:3}]}
  ]
});