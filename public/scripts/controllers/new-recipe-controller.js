'use strict';

angular.module('app').controller('newRecipeController', function ($scope, $log, $mdDialog) {
	$scope.name = '';

	$scope.done = function (action) {
		$mdDialog.hide({name: $scope.name, action: action});
	};
});