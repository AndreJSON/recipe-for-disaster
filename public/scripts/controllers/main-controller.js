'use strict';

angular.module('app').controller('mainController', function ($scope, $log, $http, $timeout) {
	$scope.user = '';
	$scope.usernames = [];

	function getUsernames () {
		$http.get('/api/usernames').then(
			function (res) {
				$scope.usernames = res.data;
			}, function (err) {
				$log.info(err);
			}
		);
	}

	function authenticateUser (name, password) {
		$http.post('/api/login', {name: name, password: password}).then(
			function (res) {
				if(res.data.success) {
					$scope.user = res.data.name;
				} else {
					$log.info("Failed to autenticate.");
				}
			}, function (err) {
				$log.info(err);
			}
		);
	}

	function init () {
		authenticateUser('Guest', '');
		getUsernames();
	}

	$timeout(init());
});