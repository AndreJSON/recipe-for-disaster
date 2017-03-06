'use strict';

angular.module('app', ['ngMaterial', 'ngRoute', 'ngMdIcons'])
	.config(function ($routeProvider) {
		$routeProvider
			.when('/', {
				templateUrl: 'views/home.html'
			})
			.when('/recipe', {
				templateUrl: 'views/recipe.html'
			})
			.when('/search', {
				templateUrl: 'views/search.html'
			})
			.otherwise({
				templateUrl: 'views/404.html'
			});
	})
	.config(function ($mdThemingProvider) {
		$mdThemingProvider.theme('default')
			.primaryPalette('teal', {
				'default': '500',
				'hue-1': '100',
				'hue-2': '600',
				'hue-3': 'A100'
			})
			.accentPalette('yellow', {
				'default': '200'
			});
	});