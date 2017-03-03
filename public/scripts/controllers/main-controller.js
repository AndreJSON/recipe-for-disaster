/*global angular*/

angular.module('app').controller('mainController', function ($scope, $log, $http, $timeout) {
	'use strict';
	
	$scope.greeting = undefined;
	
	function getGreeting() {
		$http.get('/api/greeting', {params: {name: 'Mr. World'}}).then(
			function (res) {
				$scope.greeting = res.data.greeting;
			},
			function (err) {
				$log.info('Could not get greeting.');
			}
		);
	}
	
	function init() {
		getGreeting();
	}
	
	$timeout(init);
});