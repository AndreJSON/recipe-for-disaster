'use strict';

angular.module('app').controller('loginController', function ($scope, $log, $mdDialog) {
	$scope.name = "";
	$scope.password = "";

	/**
	 * Closes the dialog, passing the content of the input fields to the parent controller.
	 */
	$scope.done = function () {
		$mdDialog.hide({name: $scope.name, password: $scope.password});
	};
});