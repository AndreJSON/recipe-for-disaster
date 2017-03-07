'use strict';

angular.module('app').controller('mainController', function ($scope, $log, $http, $timeout, $mdDialog) {
	$scope.user = '';
	$scope.usernames = [];

	function authenticateUser (name, password) {
		$http.post('/api/login', {name: name, password: password}).then(
			function (res) {
				if(res.data.success) {
					$scope.user = res.data.name;
				} else {
					$log.info("Failed to autenticate.");
					$scope.logout();
				}
			}, function (err) {
				$log.info(err);
			}
		);
	}

	$scope.logout = function (ev) {
		$scope.user = '';
		$mdDialog.show({
			controller: 'loginController',
			templateUrl: 'views/login.html',
			targetEvent: ev,
			clickOutsideToClose: false
		}).then(
			function (form) {
				$log.info(form.name);
				$log.info(form.password);
				if(form.password === undefined) { //Empty passwords are allowed, but angular might make the field undefined if not filled in.
					form.password = '';
				}
				authenticateUser(form.name, form.password);
			}
		);
	};

	function getUsernames () {
		$http.get('/api/usernames').then(
			function (res) {
				$scope.usernames = res.data;
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