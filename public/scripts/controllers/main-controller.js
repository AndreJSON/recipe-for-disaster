'use strict';

angular.module('app').controller('mainController', function ($scope, $log, $http, $timeout) {
	$scope.user = 'Guest';
	$scope.usernames = [];

	function getUsernames () {
		$http.get('/api/usernames').then(
			function (res) {
				$log.info(res.data);
			}, function (err) {
				$log.info(err);
			}
		);
	}

	function init () {
		getUsernames();
	}

	$timeout(init());
});