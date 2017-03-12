'use strict';

angular.module('app').controller('newRecipeController', function ($scope, $log, $mdDialog) {
	$scope.name = '';

	/**
	 * Closes the dialog, passing the content of the input field to the parent controller.
	 */
	$scope.done = function (action) {
		$mdDialog.hide({name: $scope.name, action: action});
	};
});