/*global angular */

angular.module('app', ['ngMaterial', 'ngRoute', 'ngMdIcons'])
	.config(function ($routeProvider) {
		'use strict';
		$routeProvider
			.when('/', {
				templateUrl: 'views/home.html'
			})
			.otherwise({
				templateUrl: 'views/404.html'
			});
	})
	.config(function ($mdThemingProvider) {
		'use strict';
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