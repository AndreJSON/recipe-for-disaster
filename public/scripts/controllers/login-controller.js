'use strict';

angular.module('app').controller('loginController', function ($scope, $log, $mdDialog) {
	$scope.name = "";
	$scope.password = "";

	$scope.done = function () {
		$mdDialog.hide({name: $scope.name, password: $scope.password});
	};
});